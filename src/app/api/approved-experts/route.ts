export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Retrieve approved experts (approved applications) to merge with static list
export async function GET() {
  try {
    const approved = await db.expertApplication.findMany({
      where: { status: 'APPROVED' },
      orderBy: { reviewedAt: 'desc' },
    });

    const experts = approved.map((a: any) => ({
      id: a.id,
      name: a.fullName,
      specialty: a.specialty,
      experience: a.experience,
      rating: 0,
      reviewCount: 0,
      phone: a.phone,
      whatsapp: a.whatsapp ? `https://wa.me/${a.whatsapp.replace(/[^0-9]/g, '')}` : '',
      image: a.profileImage || '',
      bio: a.bio,
      location: a.location,
      certifications: Array.isArray(a.certifications) ? a.certifications : [],
      availability: a.availability,
      projects: 0,
      source: 'application',
    }));

    return NextResponse.json({ experts });
  } catch (error) {
    console.error('[approved-experts/GET] Error:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
