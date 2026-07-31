import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/password';

// POST /api/auth/login - Connexion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, email, pseudo, password } = body;

    // Valider qu'au moins un identifiant est fourni (pseudo, téléphone ou email)
    if (!phone && !email && !pseudo) {
      return NextResponse.json({ error: 'Pseudo, numéro de téléphone ou email requis' }, { status: 400 });
    }

    // Vérifier le mot de passe est fourni
    if (!password) {
      return NextResponse.json({ error: 'Mot de passe requis' }, { status: 400 });
    }

    // Rechercher l'utilisateur par pseudo, téléphone ou email
    let user = null;
    if (pseudo) {
      user = await db.user.findUnique({
        where: { pseudo },
      });
    } else if (phone) {
      user = await db.user.findUnique({
        where: { phone },
      });
    } else if (email) {
      user = await db.user.findUnique({
        where: { email },
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé. Veuillez vous inscrire d\'abord.' }, { status: 404 });
    }

    // Vérifier le mot de passe
    if (user.password && password) {
      const isPasswordValid = verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: 'Mot de passe requis' }, { status: 401 });
    }

    // Update lastSeen and set user as online
    await db.user.update({
      where: { id: user.id },
      data: { isOnline: true, lastSeen: new Date() },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in login:', error);
    return NextResponse.json({ error: 'Erreur de connexion' }, { status: 500 });
  }
}