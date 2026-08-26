import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/payments-list - Récupérer tous les paiements
export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get('status');
    const payments = await db.payment.findMany({
      ...(status ? { where: { status } } : {}),
      include: {
        user: true,
        lot: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedPayments = await Promise.all(payments.map(async payment => {
      const reservation = await db.reservation.findFirst({
        where: { userId: payment.userId, lotId: payment.lotId },
        orderBy: { createdAt: 'desc' },
      });

      return ({
      id: payment.id,
      userId: payment.userId,
      userName: payment.user.name,
      lotId: payment.lotId,
      lotName: payment.lot.name,
      amount: payment.amount,
      status: payment.status,
      type: payment.type,
      paidAmount: reservation?.paidAmount || 0,
      totalPrice: reservation?.totalPrice || 0,
      createdAt: payment.createdAt.toISOString()
      });
    }));

    return NextResponse.json(formattedPayments);
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des paiements' }, { status: 500 });
  }
}
