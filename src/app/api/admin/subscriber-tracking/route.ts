import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/subscriber-tracking — Get detailed subscriber data for committee
export async function GET() {
  try {
    // Get all users (excluding admins)
    const users = await db.user.findMany({
      where: {
        role: { not: 'ADMIN' },
      },
      orderBy: { createdAt: 'desc' as const },
    });

    // Get all reservations
    const reservations = await db.reservation.findMany();

    // Get all lots
    const lots = await db.lot.findMany();

    // Get all payments
    const payments = await db.payment.findMany();

    // Build subscriber tracking data
    const subscriberData = users.map((user: any) => {
      const userReservations = reservations.filter((r: any) => r.userId === user.id);
      const reservedLots = userReservations.filter((r: any) => r.status === 'RESERVED');
      const paidLots = userReservations.filter((r: any) => r.status === 'PAID');

      // Get detailed lot info for each reservation
      const lotDetails = userReservations.map((res: any) => {
        const lot = (lots as any[]).find((l) => l.id === res.lotId);
        const lotPayments = payments.filter((p: any) => p.userId === user.id && p.lotId === res.lotId);
        const totalPaid = lotPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
        const validatedPayments = lotPayments.filter((p: any) => p.status === 'VALIDATED');
        const totalValidated = validatedPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

        return {
          reservationId: res.id,
          lotId: res.lotId,
          lotName: lot ? `${lot.name} (Îlot ${lot.block})` : 'Inconnu',
          surface: lot?.surface || '-',
          priceRes: lot?.priceRes || 0,
          priceNon: lot?.priceNon || 0,
          status: res.status,
          totalPrice: res.totalPrice,
          paidAmount: totalValidated || res.paidAmount || 0,
          remainingAmount: (res.totalPrice || 0) - (totalValidated || res.paidAmount || 0),
          paymentProgress: res.totalPrice > 0
            ? Math.round(((totalValidated || res.paidAmount || 0) / res.totalPrice) * 100)
            : 0,
          isResident: res.isResident,
          reservedAt: res.createdAt,
          lotPaymentsCount: lotPayments.length,
          validatedPaymentsCount: validatedPayments.length,
        };
      });

      const totalPaid = lotDetails.reduce((sum: number, lot: any) => sum + lot.paidAmount, 0);
      const totalRemaining = lotDetails.reduce((sum: number, lot: any) => sum + lot.remainingAmount, 0);

      return {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email || null,
        role: user.role,
        isResident: user.isResident,
        quartier: user.quartier || null,
        villageOrigine: user.villageOrigine || null,
        pseudo: user.pseudo || null,
        status: user.status,
        createdAt: user.createdAt,
        lotsReservedCount: reservedLots.length,
        lotsPurchasedCount: paidLots.length,
        totalLotsCount: userReservations.length,
        lotDetails,
        totalAmountPaid: totalPaid,
        totalAmountRemaining: totalRemaining,
        overallProgress: userReservations.length > 0
          ? Math.round(lotDetails.reduce((sum: number, lot: any) => sum + lot.paymentProgress, 0) / userReservations.length)
          : 0,
      };
    });

    return NextResponse.json(subscriberData);
  } catch (error) {
    console.error('Error fetching subscriber tracking data:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
