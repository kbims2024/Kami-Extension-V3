import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

    if (lot.status !== 'AVAILABLE') {
      return NextResponse.json({ error: 'Lot is not available' }, { status: 400 });
    }

    // Créer le paiement
    const payment = await db.payment.create({
      data: {
        userId,
        lotId,
        amount,
        status: 'VALIDATED',
        type: amount === totalPrice ? 'FULL' : 'PARTIAL',
      },
    });

    // Mettre à jour le statut du lot
    const newStatus = amount === totalPrice ? 'PAID' : 'RESERVED';
    await db.lot.update({
      where: { id: lotId },
      data: { status: newStatus },
    });

    // Créer la réservation
    const reservation = await db.reservation.create({
      data: {
        userId,
        lotId,
        paidAmount: amount,
        totalPrice,
        isResident,
        status: newStatus,
      },
    });

    // Mark congratulated lot so the user only sees the notification once
    if (newStatus === 'PAID') {
      try {
        const user = await db.user.findUnique({ where: { id: userId } });
        if (user) {
          const congratulatedLots = user.congratulatedLots ? JSON.parse(user.congratulatedLots) : [];
          if (!congratulatedLots.includes(lotId)) {
            congratulatedLots.push(lotId);
            await db.user.update({
              where: { id: userId },
              data: { congratulatedLots: JSON.stringify(congratulatedLots) },
            });
          }
        }
      } catch (markErr) {
        console.warn('Could not mark congratulated lot:', markErr);
      }
    }

    // Notify all management committee members and admins about the new reservation
    try {
      const user = await db.user.findUnique({ where: { id: userId } });
      const notificationType = newStatus === 'PAID' ? 'ACHAT' : 'RESERVATION';
      const notifTitle = newStatus === 'PAID' ? '🛒 Nouvel achat de lot' : '📌 Nouvelle réservation de lot';
      const notifMessage = newStatus === 'PAID'
        ? `${user?.name || 'Un souscripteur'} a acheté le lot ${lot.name} (${lot.block || ''}) pour ${amount.toLocaleString('fr-FR')} F`
        : `${user?.name || 'Un souscripteur'} a réservé le lot ${lot.name} (${lot.block || ''}) — Versement initial: ${amount.toLocaleString('fr-FR')} F / ${totalPrice.toLocaleString('fr-FR')} F`;

      const extraData = JSON.stringify({
        reservationId: reservation.id,
        userId,
        userName: user?.name || 'Inconnu',
        userPhone: user?.phone || '',
        lotId,
        lotName: lot.name,
        lotBlock: lot.block || '',
        amount,
        totalPrice,
        status: newStatus,
        isResident,
      });

      // Get all committee members and admins
      const [committeeMembers, admins] = await Promise.all([
        db.user.findMany({ where: { role: 'MANAGEMENT_COMMITTEE', status: 'ACTIVE' } }),
        db.user.findMany({ where: { role: 'ADMIN', status: 'ACTIVE' } }),
      ]);

      const notifyTargets = [...committeeMembers, ...admins];

      // Create notification for each member
      for (const member of notifyTargets) {
        await db.notification.create({
          data: {
            userId: member.id,
            title: notifTitle,
            message: notifMessage,
            type: notificationType,
            read: false,
            data: extraData,
          },
        });
      }

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
