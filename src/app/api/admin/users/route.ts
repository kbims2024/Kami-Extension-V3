import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/users - Récupérer tous les utilisateurs
export async function GET() {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        reservations: true,
        payments: true
      }
    });

    // Add statistics for each user
    const usersWithStats = users.map(user => {
      const reservationCount = user.reservations.length;
      const totalPaid = user.payments
        .filter(p => p.status === 'VALIDATED')
        .reduce((sum, p) => sum + p.amount, 0);

      return {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        isResident: user.isResident,
        quartier: user.quartier || null,
        villageOrigine: user.villageOrigine || null,
        referralCode: user.referralCode,
        status: user.status,
        reservationCount,
        totalPaid,
        createdAt: user.createdAt.toISOString()
      };
    });

    return NextResponse.json(usersWithStats);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des utilisateurs' }, { status: 500 });
  }
}

// DELETE /api/admin/users - Supprimer un utilisateur
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 });
    }

    await db.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}