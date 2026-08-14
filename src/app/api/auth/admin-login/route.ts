import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/password';

// Code secret admin — modifiable ici ou via variable d'environnement
const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE || 'KAMI2024ADMIN';

// POST /api/auth/admin-login — Connexion admin avec code secret
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, email, password, adminCode } = body;

    // Vérifier que le code secret admin est fourni
    if (!adminCode) {
      return NextResponse.json({ error: 'Code d\'accès administrateur requis' }, { status: 400 });
    }

    // Vérifier le code secret admin
    if (adminCode !== ADMIN_SECRET_CODE) {
      return NextResponse.json({ error: 'Code d\'accès administrateur invalide' }, { status: 403 });
    }

    // Vérifier qu'au moins un identifiant est fourni
    if (!phone && !email) {
      return NextResponse.json({ error: 'Numéro de téléphone ou email requis' }, { status: 400 });
    }

    // Vérifier le mot de passe
    if (!password) {
      return NextResponse.json({ error: 'Mot de passe requis' }, { status: 400 });
    }

    // Rechercher l'utilisateur
    let user: any = null;
    if (phone) {
      user = await db.user.findUnique({ where: { phone } });
    } else if (email) {
      user = await db.user.findUnique({ where: { email } });
    }

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Vérifier le mot de passe
    if ((user as any).password && password) {
      const isPasswordValid = verifyPassword(password, (user as any).password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: 'Mot de passe requis' }, { status: 401 });
    }

    // Promouvoir l'utilisateur en ADMIN si ce n'est pas déjà le cas
    if ((user as any).role !== 'ADMIN') {
      await db.user.update({
        where: { id: (user as any).id },
        data: { role: 'ADMIN' },
      });
    }

    // Retourner l'utilisateur avec le rôle ADMIN
    return NextResponse.json({
      ...(user as any),
      role: 'ADMIN',
    });
  } catch (error) {
    console.error('Error in admin login:', error);
    return NextResponse.json({ error: 'Erreur de connexion admin' }, { status: 500 });
  }
}
