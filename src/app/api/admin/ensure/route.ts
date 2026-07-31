import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Try to find admin user
    let admin = await db.user.findFirst({
      where: {
        phone: 'ADMIN',
      },
    });

    // Create admin if doesn't exist
    if (!admin) {
      admin = await db.user.create({
        data: {
          name: 'Administrateur',
          phone: 'ADMIN',
          isResident: true,
        },
      });
    }

    return NextResponse.json({ adminId: admin.id, adminName: admin.name });
  } catch (error) {
    console.error('Error getting admin:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération de l\'admin' }, { status: 500 });
  }
}