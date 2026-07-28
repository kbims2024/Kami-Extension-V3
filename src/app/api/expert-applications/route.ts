import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Submit a new expert application (public)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      fullName,
      phone,
      whatsapp,
      categoryId,
      specialty,
      experience,
      location,
      certifications, // array of strings
      bio,
      availability,
    } = body;

    // Validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 3) {
      return NextResponse.json({ error: 'Le nom complet est requis (min. 3 caractères).' }, { status: 400 });
    }
    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      return NextResponse.json({ error: 'Le numéro de téléphone est requis.' }, { status: 400 });
    }
    if (!categoryId || typeof categoryId !== 'string') {
      return NextResponse.json({ error: 'La catégorie d\'expertise est requise.' }, { status: 400 });
    }
    if (!specialty || typeof specialty !== 'string' || specialty.trim().length < 3) {
      return NextResponse.json({ error: 'La spécialité est requise.' }, { status: 400 });
    }
    if (!experience || typeof experience !== 'string') {
      return NextResponse.json({ error: 'L\'expérience est requise.' }, { status: 400 });
    }
    if (!location || typeof location !== 'string') {
      return NextResponse.json({ error: 'La localisation est requise.' }, { status: 400 });
    }
    if (!bio || typeof bio !== 'string' || bio.trim().length < 10) {
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

    const certJson = Array.isArray(certifications)
      ? JSON.stringify(certifications.filter((c: unknown) => typeof c === 'string' && c.trim().length > 0))
      : '[]';

    const application = await prisma.expertApplication.create({
      data: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp?.trim() || null,
        categoryId,
        specialty: specialty.trim(),
        experience: experience.trim(),
        location: location.trim(),
        certifications: certJson,
        bio: bio.trim(),
        availability: availability?.trim() || 'Disponible sous 72h',
        status: 'PENDING',
      },
    });

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
    const status = searchParams.get('status'); // PENDING, APPROVED, REJECTED, or null (all)

    const where = status && status !== 'ALL' ? { status } : {};

    const applications = await prisma.expertApplication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Parse certifications JSON for each
    const parsed = applications.map((a) => ({
      ...a,
      certifications: (() => {
        try {
          return JSON.parse(a.certifications);
        } catch {
          return [];
        }
      })(),
    }));

    return NextResponse.json({ applications: parsed });
  } catch (error) {
    console.error('[expert-applications/GET] Error:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
