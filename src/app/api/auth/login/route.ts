import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/password';

// POST /api/auth/login - Connexion ou inscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, isResident, password } = body;

    // Valider qu'au moins un identifiant est fourni (email ou téléphone)
    if (!name || (!phone && !email)) {
      return NextResponse.json({ error: 'Nom et au moins un identifiant (téléphone ou email) sont requis' }, { status: 400 });
    }

    // Vérifier le mot de passe est fourni
    if (!password) {
      return NextResponse.json({ error: 'Mot de passe requis' }, { status: 400 });
    }

    // Rechercher l'utilisateur par téléphone ou par email
    let user = null;
    if (phone) {
      user = await db.user.findUnique({
        where: { phone },
      });
    } else if (email) {
      user = await db.user.findUnique({
        where: { email },
      });
    }

    if (!user) {
      // Créer un nouvel utilisateur
      const referralCode = `${name.substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;
      user = await db.user.create({
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
    } else {
      // Vérifier le mot de passe si l'utilisateur en a un
      if (user.password && password) {
        const isPasswordValid = verifyPassword(password, user.password);
        if (!isPasswordValid) {
          return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
        }
      } else if (user.password && !password) {
        return NextResponse.json({ error: 'Mot de passe requis' }, { status: 401 });
      }
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in login:', error);
    return NextResponse.json({ error: 'Erreur de connexion' }, { status: 500 });
  }
}
