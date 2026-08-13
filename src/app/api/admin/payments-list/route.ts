export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/payments-list - Récupérer tous les paiements
export async function GET() {
  try {
    const payments = await db.payment.findMany({
      include: {
        user: true,
        lot: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedPayments = payments.map(payment => ({
      id: payment.id,
      userId: payment.userId,
      userName: payment.user.name,
      lotId: payment.lotId,
      lotName: payment.lot.name,
      amount: payment.amount,
      status: payment.status,
      type: payment.type,
      createdAt: payment.createdAt.toISOString()
    }));

    return NextResponse.json(formattedPayments);
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des paiements' }, { status: 500 });
  }
}
