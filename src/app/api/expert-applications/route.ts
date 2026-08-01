import { NextRequest, NextResponse } from 'next/server';
import { GridFSBucket, ObjectId } from 'mongodb';
import { connectDB } from '@/lib/mongodb';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

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
      return NextResponse.json({ error: 'Format d\'image non supporté (JPEG, PNG, WebP ou GIF requis).' }, { status: 400 });
    }

    // Validate image size (max 10MB)
    if (profileImage.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'L\'image ne doit pas dépasser 10 Mo.' }, { status: 400 });
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

    // Upload profile image to GridFS
    const mongoose = await connectDB();
    const dbClient = mongoose.connection.db;
    const bucket = new GridFSBucket(dbClient, { bucketName: 'uploads' });

    const timestamp = Date.now();
    const safeName = profileImage.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `expert_${timestamp}_${safeName}`;

    const buffer = Buffer.from(await profileImage.arrayBuffer());

    const uploadStream = bucket.openUploadStream(filename, {
      contentType: profileImage.type,
      metadata: {
        originalName: profileImage.name,
        type: 'expert-photo',
      },
    });

    await new Promise<void>((resolve, reject) => {
      uploadStream.on('error', (err) => reject(err));
      uploadStream.on('finish', () => resolve());
      uploadStream.end(buffer);
    });

    const fileId = uploadStream.id.toString();

    // store metadata in uploadedFiles collection
    await dbClient.collection('uploadedFiles').insertOne({
      _id: uploadStream.id,
      fileId,
      filename,
      originalName: profileImage.name,
      mimeType: profileImage.type,
      size: buffer.length,
      type: 'expert-photo',
      uploadedAt: new Date(),
    });

    const profileImageUrl = `/api/serve-file?fileId=${fileId}`;

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
        profileImage: profileImageUrl,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      id: application.id,
      message: 'Votre candidature a été soumise au comité de gestion des lots. Vous serez notifié après analyse.',
      profileImageUrl,
      fileId,
    });
  } catch (error) {
    console.error('[expert-applications/POST] Error (GridFS):', error);
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
