import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/user-stats?userId=xxx - Récupérer les statistiques d'un utilisateur
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Récupérer toutes les réservations de l'utilisateur
    const reservations = await db.reservation.findMany({
      where: { userId },
      include: {
        lot: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculer les statistiques
    const stats = {
      totalReservations: reservations.length,
      lotsReserved: reservations.filter((r) => r.status === 'RESERVED').length,
      lotsPaid: reservations.filter((r) => r.status === 'PAID').length,
      lotsPending: reservations.filter((r) => r.status === 'PENDING').length,
      totalPaid: reservations.reduce((sum, r) => sum + (r.paidAmount || 0), 0),
      totalValue: reservations.reduce((sum, r) => sum + (r.totalPrice || 0), 0),
      totalRemaining: reservations.reduce((sum, r) => sum + ((r.totalPrice || 0) - (r.paidAmount || 0)), 0),
      globalProgress: reservations.reduce((sum, r) => sum + (r.totalPrice || 0), 0) > 0
        ? Math.round((reservations.reduce((sum, r) => sum + (r.paidAmount || 0), 0) / reservations.reduce((sum, r) => sum + (r.totalPrice || 0), 0)) * 100)
        : 0,
    };

    // Statistiques mensuelles (simulées pour l'exemple - peut être remplacé par des données réelles)
    const monthlyStats = [
      { month: 'Jan', paid: 0, value: 0 },
      { month: 'Fév', paid: 0, value: 0 },
      { month: 'Mar', paid: 0, value: 0 },
      { month: 'Avr', paid: 0, value: 0 },
      { month: 'Mai', paid: 0, value: 0 },
      { month: 'Juin', paid: 0, value: 0 },
      { month: 'Juil', paid: 0, value: 0 },
      { month: 'Août', paid: 0, value: 0 },
      { month: 'Sep', paid: 0, value: 0 },
      { month: 'Oct', paid: 0, value: 0 },
      { month: 'Nov', paid: 0, value: 0 },
      { month: 'Déc', paid: 0, value: 0 },
    ];

    // Remplir les données réelles basées sur les paiements
    const currentYear = new Date().getFullYear();
    reservations.forEach((reservation) => {
      reservation.payments.forEach((payment) => {
        const paymentDate = new Date(payment.createdAt);
        if (paymentDate.getFullYear() === currentYear) {
          const monthIndex = paymentDate.getMonth();
          monthlyStats[monthIndex].paid += payment.amount;
        }
      });

      const reservationDate = new Date(reservation.createdAt);
      if (reservationDate.getFullYear() === currentYear) {
        const monthIndex = reservationDate.getMonth();
        monthlyStats[monthIndex].value += reservation.totalPrice;
      }
    });

    return NextResponse.json({
      stats,
      monthlyStats,
      reservations: reservations.map((r) => ({
        id: r.id,
        lotId: r.lotId,
        lotName: r.lot.name,
        surface: r.lot.surface,
        paidAmount: r.paidAmount,
        totalPrice: r.totalPrice,
        isResident: r.isResident,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
        block: r.lot.block,
      })),
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Failed to fetch user stats' }, { status: 500 });
  }
}
