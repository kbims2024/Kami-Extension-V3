export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/stats - Récupérer les statistiques
export async function GET() {
  try {
    // Récupérer tous les lots
    const lots = await db.lot.findMany();

    // Compter les lots par statut
    const available = lots.filter((l: any) => l.status === 'AVAILABLE').length;
    const reserved = lots.filter((l: any) => l.status === 'RESERVED').length;
    const paid = lots.filter((l: any) => l.status === 'PAID').length;

    // Récupérer toutes les réservations
    const reservations = await db.reservation.findMany();

    // Calculer les revenus
    const revenue = reservations.reduce((sum: number, res: any) => sum + res.paidAmount, 0);

    // Récupérer le nombre d'utilisateurs
    const userCount = await db.user.count();

    // Récupérer le nombre de réservations en attente de validation
    const pendingPayments = reservations.filter((r: any) => r.paidAmount < r.totalPrice).length;

    return NextResponse.json({
      available,
      reserved,
      paid,
      total: lots.length,
      revenue,
      userCount,
      pendingPayments,
      reservationCount: reservations.length,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des statistiques' }, { status: 500 });
  }
}
