import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifyManagement } from '@/lib/management-notifications';

// GET /api/reservations?userId=xxx - Récupérer les réservations d'un utilisateur
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const reservations = await db.reservation.findMany({
      where: { userId },
      include: {
        lot: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transformer le format pour correspondre au frontend
    const formattedReservations = reservations.map((r) => ({
      id: r.id,
      lotId: r.lotId,
      lotName: r.lot.name,
      surface: r.lot.surface,
      paidAmount: r.paidAmount,
      totalPrice: r.totalPrice,
      isResident: r.isResident,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedReservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
  }
}

// POST /api/reservations - Créer une nouvelle réservation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, lotId, amount, totalPrice, isResident } = body;

    if (!userId || !lotId || !amount || !totalPrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Récupérer le lot
    const lot = await db.lot.findUnique({
      where: { id: lotId },
    });

    if (!lot) {
      return NextResponse.json({ error: 'Lot not found' }, { status: 404 });
    }

    const existingReservation = await db.reservation.findFirst({
      where: { userId, lotId },
      orderBy: { createdAt: 'desc' },
    });

    if (lot.status !== 'AVAILABLE' && !existingReservation) {
      return NextResponse.json({ error: 'Lot is not available' }, { status: 400 });
    }

    // Créer le paiement
    const payment = await db.payment.create({
      data: {
        userId,
        lotId,
        amount,
        status: 'PENDING',
        type: amount === totalPrice ? 'FULL' : 'PARTIAL',
      },
    });

    const reservation = existingReservation
      ? existingReservation
      : await db.reservation.create({
          data: {
            userId,
            lotId,
            paidAmount: 0,
            totalPrice,
            isResident,
            status: 'RESERVED',
          },
        });

    if (!existingReservation) {
      await db.lot.update({
        where: { id: lotId },
        data: { status: 'RESERVED' },
      });
    }

    // Mark congratulated lot so the user only sees the notification once
    // Notify all management committee members and admins about the new reservation
    try {
      const user = await db.user.findUnique({ where: { id: userId } });
      const notificationType = 'PAYMENT';
      const notifTitle = '💰 Paiement à valider';
      const notifMessage = `${user?.name || 'Un souscripteur'} a déclaré un paiement de ${amount.toLocaleString('fr-FR')} F pour le lot ${lot.name} (${lot.block || ''}).`;

      await notifyManagement({
        title: notifTitle,
        message: notifMessage,
        type: notificationType,
        data: {
          reservationId: reservation.id,
          userId,
          userName: user?.name || 'Inconnu',
          userPhone: user?.phone || '',
          lotId,
          lotName: lot.name,
          lotBlock: lot.block || '',
          amount,
          totalPrice,
          status: 'PENDING',
          isResident,
          screen: 'payments',
        },
      });

      // Also send a chat message to the ADMIN for immediate visibility
      try {
        const admin = await db.user.findFirst({ where: { phone: 'ADMIN' } });
        if (admin) {
          await db.message.create({
            data: {
              content: `🔔 ${notifMessage}`,
              senderId: userId,
              receiverId: admin.id,
            },
          });
        }
      } catch (chatErr) {
        // Chat notification is best-effort, don't fail the reservation
        console.warn('Could not send chat notification:', chatErr);
      }
    } catch (notifErr) {
      // Notification failure should not block the reservation
      console.warn('Could not send committee notifications:', notifErr);
    }

    // Récupérer la réservation avec les infos du lot
    const fullReservation = await db.reservation.findUnique({
      where: { id: reservation.id },
      include: {
        lot: true,
      },
    });

    return NextResponse.json({
      id: fullReservation!.id,
      lotId: fullReservation!.lotId,
      lotName: fullReservation!.lot.name,
      surface: fullReservation!.lot.surface,
      paidAmount: fullReservation!.paidAmount,
      totalPrice: fullReservation!.totalPrice,
      isResident: fullReservation!.isResident,
      status: fullReservation!.status,
      createdAt: fullReservation!.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}
