import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/auth/login - Connexion ou inscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, isResident } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe déjà
    let user = await db.user.findUnique({
      where: { phone },
    });

    if (!user) {
      // Créer un nouvel utilisateur
      const referralCode = `${name.substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;
      user = await db.user.create({
        data: {
          name,
          phone,
          isResident: isResident !== undefined ? isResident : true,
          referralCode,
          status: 'ACTIVE',
        },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in login:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
