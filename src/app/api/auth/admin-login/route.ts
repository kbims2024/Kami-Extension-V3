import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, hashPassword, isLegacyPasswordHash } from '@/lib/password';

// Code secret admin — doit être défini via la variable d'environnement ADMIN_SECRET_CODE.
// En production, AUCUN code par défaut n'est accepté.
const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE;
const DEFAULT_DEV_CODE = 'KAMI2024ADMIN';

if (!ADMIN_SECRET_CODE) {
  console.warn('[ADMIN] ADMIN_SECRET_CODE non défini. En production, l\'accès admin sera refusé.');
}

function isAdminCodeValid(code: string): boolean {
  if (!code) return false;
  if (ADMIN_SECRET_CODE) return code === ADMIN_SECRET_CODE;
  // Hors production uniquement, conserver un code de secours pour le développement.
  return process.env.NODE_ENV !== 'production' && code === DEFAULT_DEV_CODE;
}

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
    if (!isAdminCodeValid(adminCode)) {
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
