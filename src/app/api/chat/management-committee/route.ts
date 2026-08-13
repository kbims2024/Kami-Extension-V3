export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Récupérer tous les membres du comité de gestion pour le chat
export async function GET() {
  try {
    const committeeMembers = await db.user.findMany({
      where: {
        role: 'MANAGEMENT_COMMITTEE',
        status: 'ACTIVE'
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(committeeMembers);
  } catch (error) {
    console.error('Error fetching management committee:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du comité de gestion' },
      { status: 500 }
    );
  }
}
