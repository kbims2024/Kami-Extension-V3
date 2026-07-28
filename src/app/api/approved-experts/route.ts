import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Retrieve approved experts (approved applications) to merge with static list
export async function GET() {
  try {
    const approved = await prisma.expertApplication.findMany({
      where: { status: 'APPROVED' },
      orderBy: { reviewedAt: 'desc' },
    });

    const experts = approved.map((a) => ({
      id: a.id,
      name: a.fullName,
      specialty: a.specialty,
      experience: a.experience,
      rating: 0, // New approved experts start at 0 until they get reviews
      reviewCount: 0,
      phone: a.phone,
      whatsapp: a.whatsapp ? `https://wa.me/${a.whatsapp.replace(/[^0-9]/g, '')}` : '',
      image: '', // No image yet
      bio: a.bio,
      location: a.location,
      certifications: (() => {
        try {
          return JSON.parse(a.certifications);
        } catch {
          return [];
        }
      })(),
      availability: a.availability,
      projects: 0,
      source: 'application', // to differentiate from static experts
    }));

    return NextResponse.json({ experts });
  } catch (error) {
    console.error('[approved-experts/GET] Error:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
