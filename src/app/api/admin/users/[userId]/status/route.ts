import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PUT /api/admin/users/[userId]/status - Bloquer ou débloquer un utilisateur
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['ACTIVE', 'BLOCKED'].includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide. Doit être ACTIVE ou BLOCKED' },
        { status: 400 }
      );
    }

    const user = await db.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
      },
    });

    return NextResponse.json({
      success: true,
      user,
      message: status === 'ACTIVE' ? 'Utilisateur activé' : 'Utilisateur bloqué',
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du statut' },
      { status: 500 }
    );
  }
}