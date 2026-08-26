import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 });
    }

    // Get user's reservations
    const reservations = await db.reservation.findMany({
      where: { userId },
      include: {
        lot: true,
      },
    });

    const paymentNotification = await db.notification.findFirst({
      where: {
        userId,
        type: { in: ['PAYMENT_VALIDATED', 'PAYMENT_REJECTED'] },
        read: false,
      },
      orderBy: { createdAt: 'desc' },
    });
    const unreadCount = await db.notification.count({ where: { userId, read: false } });

    // Check if user has any fully paid lots
    for (const reservation of reservations) {
      if (reservation.paidAmount >= reservation.totalPrice && reservation.status === 'PAID') {
        // Check if user has already been congratulated for this lot
        const user = await db.user.findUnique({
          where: { id: userId },
          select: { congratulatedLots: true },
        });

        if (user) {
          const congratulatedLots = user.congratulatedLots ? JSON.parse(user.congratulatedLots) : [];
          if (!congratulatedLots.includes(reservation.lotId)) {
            // User has not been congratulated yet for this lot
            const updatedLots = [...congratulatedLots, reservation.lotId];
            await db.user.update({
              where: { id: userId },
              data: { congratulatedLots: JSON.stringify(updatedLots) },
            });
            return NextResponse.json({
              shouldShow: true,
              lotName: reservation.lot.name,
              lotBlock: reservation.lot.block,
              lotId: reservation.lotId,
              paymentValidated: paymentNotification,
              unreadCount,
            });
          }
        }
      }
    }

    return NextResponse.json({ shouldShow: false, paymentValidated: paymentNotification, unreadCount });
  } catch (error) {
    console.error('Error checking notifications:', error);
    return NextResponse.json({ error: 'Erreur lors de la vérification' }, { status: 500 });
  }
}
