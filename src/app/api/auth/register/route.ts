import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/password';

// POST /api/auth/register - Inscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, password, isResident } = body;

    // Validation des champs
    if (!name || !password) {
      return NextResponse.json({ error: 'Nom et mot de passe sont requis' }, { status: 400 });
    }

    if (!phone && !email) {
      return NextResponse.json({ error: 'Numéro de téléphone ou email requis' }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe déjà
    let existingUser = null;
    if (phone) {
      existingUser = await db.user.findUnique({
        where: { phone },
      });
    } else if (email) {
      existingUser = await db.user.findUnique({
        where: { email },
      });
    }

    if (existingUser) {
      return NextResponse.json({ error: 'Un utilisateur avec ces identifiants existe déjà' }, { status: 409 });
    }

    // Créer le nouvel utilisateur
    const referralCode = `${name.substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;

    const newUser = await db.user.create({
      data: {
        name,
        phone: phone || null,
        email: email || null,
        isResident: isResident !== undefined ? isResident : true,
        referralCode,
        status: 'ACTIVE',
        password: password ? hashPassword(password) : null,
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error in registration:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'inscription' }, { status: 500 });
  }
}