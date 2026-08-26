import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifyManagement } from '@/lib/management-notifications';

// Helper: convert a File to a base64 data URI
async function fileToDataUri(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}

// POST - Submit a new expert application with profile image (public)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const profileImage = formData.get('profileImage') as File | null;

    const fullName = (formData.get('fullName') as string) || '';
    const phone = (formData.get('phone') as string) || '';
    const whatsapp = (formData.get('whatsapp') as string) || '';
    const categoryId = (formData.get('categoryId') as string) || '';
    const specialty = (formData.get('specialty') as string) || '';
    const experience = (formData.get('experience') as string) || '';
    const location = (formData.get('location') as string) || '';
    const certificationsRaw = (formData.get('certifications') as string) || '[]';
    const bio = (formData.get('bio') as string) || '';
    const availability = (formData.get('availability') as string) || '';

    // Validation - profile image is mandatory
    if (!profileImage || !profileImage.name || profileImage.size === 0) {
      return NextResponse.json({ error: 'La photo de profil est obligatoire.' }, { status: 400 });
    }

    // Validate image type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validImageTypes.includes(profileImage.type)) {
      return NextResponse.json({ error: "Format d'image non supporté (JPEG, PNG, WebP ou GIF requis)." }, { status: 400 });
    }

    // Validate image size (max 5MB)
    if (profileImage.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "L'image ne doit pas dépasser 5 Mo." }, { status: 400 });
    }

    // Other validations
    if (!fullName || fullName.trim().length < 3) {
      return NextResponse.json({ error: 'Le nom complet est requis (min. 3 caractères).' }, { status: 400 });
    }
    if (!phone || phone.trim().length < 8) {
      return NextResponse.json({ error: 'Le numéro de téléphone est requis.' }, { status: 400 });
    }
    if (!categoryId) {
      return NextResponse.json({ error: 'La catégorie d\'expertise est requise.' }, { status: 400 });
    }
    if (!specialty || specialty.trim().length < 3) {
      return NextResponse.json({ error: 'La spécialité est requise.' }, { status: 400 });
    }
    if (!experience) {
      return NextResponse.json({ error: 'L\'expérience est requise.' }, { status: 400 });
    }
    if (!location) {
      return NextResponse.json({ error: 'La localisation est requise.' }, { status: 400 });
    }
    if (!bio || bio.trim().length < 10) {
      return NextResponse.json({ error: 'La biographie est requise (min. 10 caractères).' }, { status: 400 });
    }

    const allowedCategories = [
      'electricien',
      'plombier',
      'macon',
      'menuisier',
      'carreleur',
      'peintre',
      'conducteur_travaux',
      'geometre',
    ];
    if (!allowedCategories.includes(categoryId)) {
      return NextResponse.json({ error: 'Catégorie invalide.' }, { status: 400 });
    }

    // Parse certifications
    let certifications: string[] = [];
    try {
      const parsed = JSON.parse(certificationsRaw);
      if (Array.isArray(parsed)) {
        certifications = parsed.filter((c: unknown) => typeof c === 'string' && c.trim().length > 0);
      }
    } catch {
      certifications = [];
    }

    // Convert profile image to base64 data URI (stored inline, NOT via UploadedFile)
    const profileImageDataUri = await fileToDataUri(profileImage);

    const application = await db.expertApplication.create({
      data: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp?.trim() || null,
        categoryId,
        specialty: specialty.trim(),
        experience: experience.trim(),
        location: location.trim(),
        certifications,
        bio: bio.trim(),
        availability: availability?.trim() || 'Disponible sous 72h',
        profileImage: profileImageDataUri,
        status: 'PENDING',
      },
    });

    try {
      await notifyManagement({
        title: '🧰 Nouvelle candidature expert',
        message: `${application.fullName} a envoyé une candidature d'expert.`,
        type: 'EXPERT_APPLICATION',
        data: { screen: 'expert-applications', applicationId: application.id, userName: application.fullName },
      });
    } catch (notificationError) {
      console.warn('Notification candidature non envoyée:', notificationError);
    }

    return NextResponse.json({
      success: true,
      id: application.id,
      message: 'Votre candidature a été soumise au comité de gestion des lots. Vous serez notifié après analyse.',
    });
  } catch (error) {
    console.error('[expert-applications/POST] Error:', error);
    return NextResponse.json({ error: 'Erreur serveur lors de la soumission.' }, { status: 500 });
  }
}

// GET - List applications (admin/committee only)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where = status && status !== 'ALL' ? { status } : {};

    const applications = await db.expertApplication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('[expert-applications/GET] Error:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
