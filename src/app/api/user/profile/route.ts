import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/user/profile?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      pseudo: user.pseudo,
      phone: user.phone,
      email: user.email,
      avatarUrl: user.avatarUrl || null,
      isResident: user.isResident,
      quartier: user.quartier,
      referralCode: user.referralCode,
      status: user.status,
      role: user.role,
    });
  } catch (error) {
    console.error('Erreur profil GET:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT /api/user/profile - Mettre à jour le profil
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, pseudo, phone, email, quartier, avatarUrl } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Validation
    if (name && name.trim().length < 2) {
      return NextResponse.json({ error: 'Le nom doit contenir au moins 2 caractères' }, { status: 400 });
    }

    if (pseudo !== undefined && pseudo.trim().length < 2) {
      return NextResponse.json({ error: 'Le pseudo doit contenir au moins 2 caractères' }, { status: 400 });
    }

    if (quartier && !existingUser.isResident) {
      return NextResponse.json({ error: 'Le quartier est réservé aux résidents KAMI' }, { status: 400 });
    }

    const validQuartiers = ['ASSAKLA', "N'GLOH", "N'ZOKLOH", "N'GUOUAH"];
    if (quartier && existingUser.isResident && !validQuartiers.includes(quartier)) {
      return NextResponse.json({ error: 'Quartier invalide' }, { status: 400 });
    }

    // Construction des données de mise à jour
    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (pseudo !== undefined) updateData.pseudo = pseudo.trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (email !== undefined) updateData.email = email.trim() || null;
    if (existingUser.isResident && quartier !== undefined) {
      updateData.quartier = quartier || null;
    }

    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl || null;
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      pseudo: updatedUser.pseudo,
      phone: updatedUser.phone,
      email: updatedUser.email,
      isResident: updatedUser.isResident,
      quartier: updatedUser.quartier,
      referralCode: updatedUser.referralCode,
      status: updatedUser.status,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error('Erreur profil PUT:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}