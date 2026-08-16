import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, hashPassword, isLegacyPasswordHash } from '@/lib/password';

// POST /api/auth/login - Connexion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, pseudo, password } = body;

    // Valider qu'au moins un identifiant est fourni (pseudo ou téléphone)
    if (!phone && !pseudo) {
      return NextResponse.json({ error: 'Pseudo ou numéro de téléphone requis' }, { status: 400 });
    }

    // Vérifier le mot de passe est fourni
    if (!password) {
      return NextResponse.json({ error: 'Mot de passe requis' }, { status: 400 });
    }

    // Rechercher l'utilisateur par pseudo ou par téléphone
    let user: any = null;
    if (pseudo) {
      user = await db.user.findUnique({
        where: { pseudo },
      });
    } else if (phone) {
      user = await db.user.findUnique({
        where: { phone },
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé. Veuillez vous inscrire d\'abord.' }, { status: 404 });
    }

    // Vérifier le mot de passe
    if ((user as any).password && password) {
      const isPasswordValid = await verifyPassword(password, (user as any).password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
      }

      // Migration silencieuse des anciens hash (SHA-256) vers scrypt
      if (isLegacyPasswordHash((user as any).password)) {
        await db.user.update({
          where: { id: (user as any).id },
          data: { password: await hashPassword(password) },
        });
      }
    } else {
      return NextResponse.json({ error: 'Mot de passe requis' }, { status: 401 });
    }

    // Update lastSeen and set user as online
    await db.user.update({
      where: { id: (user as any).id },
      data: { isOnline: true, lastSeen: new Date() },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in login:', error);
    return NextResponse.json({ error: 'Erreur de connexion' }, { status: 500 });
  }
}
