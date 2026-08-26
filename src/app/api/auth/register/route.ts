import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { notifyManagement } from '@/lib/management-notifications';

// POST /api/auth/register - Inscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, pseudo, phone, password, isResident, quartier, villageOrigine } = body;

    // Validation des champs obligatoires
    if (!name || !pseudo || !password) {
      return NextResponse.json({ error: 'Nom, pseudo et mot de passe sont requis' }, { status: 400 });
    }

    if (pseudo.trim().length < 2) {
      return NextResponse.json({ error: 'Le pseudo doit contenir au moins 2 caractères' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 6 caractères' }, { status: 400 });
    }

    // Validation pour les résidents KAMI
    if (isResident && !quartier) {
      return NextResponse.json({ error: 'Le quartier est requis pour les résidents KAMI' }, { status: 400 });
    }

    // Validation pour les non-résidents
    if (isResident === false && !villageOrigine) {
      return NextResponse.json({ error: 'Le village d\'origine est requis pour les non-résidents' }, { status: 400 });
    }

    // Vérifier si le pseudo est déjà pris
    const existingPseudo = await db.user.findUnique({
      where: { pseudo: pseudo.trim() },
    });
    if (existingPseudo) {
      return NextResponse.json({ error: 'Ce pseudo est déjà utilisé' }, { status: 409 });
    }

    // Vérifier si le téléphone est déjà utilisé (si fourni)
    if (phone) {
      const existingPhone = await db.user.findUnique({
        where: { phone },
      });
      if (existingPhone) {
        return NextResponse.json({ error: 'Ce numéro de téléphone est déjà utilisé' }, { status: 409 });
      }
    }

    // Créer le nouvel utilisateur
    const referralCode = `${pseudo.substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;

    const newUser = await db.user.create({
      data: {
        name,
        pseudo: pseudo.trim(),
        phone: phone || null,
        isResident: isResident !== undefined ? isResident : true,
        quartier: isResident ? quartier : null,
        villageOrigine: !isResident ? villageOrigine : null,
        referralCode,
        status: 'ACTIVE',
        password: password ? await hashPassword(password) : null,
      },
    });

    try {
      await notifyManagement({
        title: '👤 Nouveau inscrit',
        message: `${newUser.name} vient de créer un compte.`,
        type: 'INSCRIPTION',
        data: { screen: 'user-management', userId: newUser.id, userName: newUser.name },
      });
    } catch (notificationError) {
      console.warn('Notification inscription non envoyée:', notificationError);
    }

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error in registration:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'inscription' }, { status: 500 });
  }
}
