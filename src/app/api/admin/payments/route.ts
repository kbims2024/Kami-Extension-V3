import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifyManagement } from '@/lib/management-notifications';

// GET /api/admin/payments - Récupérer toutes les réservations
export async function GET() {
  try {
    const reservations = await db.reservation.findMany({
      include: {
        user: true,
        lot: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des paiements' }, { status: 500 });
  }
}

// PUT /api/admin/payments - Valider ou mettre à jour un paiement
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json({ error: 'ID paiement requis' }, { status: 400 });
    }

    const payment = await db.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Paiement non trouvé' }, { status: 404 });
    }
    if (payment.status !== 'PENDING') {
      return NextResponse.json({ error: 'Ce paiement a déjà été traité' }, { status: 400 });
    }

    const reservation = await db.reservation.findFirst({
      where: { userId: payment.userId, lotId: payment.lotId },
      orderBy: { createdAt: 'desc' },
    });
    if (!reservation) {
      return NextResponse.json({ error: 'Réservation liée non trouvée' }, { status: 404 });
    }

    const newPaidAmount = reservation.paidAmount + payment.amount;

    // Le statut de réservation reste distinct du statut du paiement.
    const newStatus = newPaidAmount >= reservation.totalPrice ? 'PAID' : 'RESERVED';

    // Mettre à jour la réservation
    const updatedReservation = await db.reservation.update({
      where: { id: reservation.id },
      data: {
        paidAmount: newPaidAmount,
        status: newStatus,
      },
    });

    await db.payment.update({
      where: { id: payment.id },
      data: { status: 'VALIDATED' },
    });

    try {
      await db.notification.create({
        data: {
          userId: reservation.userId,
          title: '✅ Paiement validé par le CGL',
          message: `Votre paiement de ${newPaidAmount.toLocaleString('fr-FR')} F pour le lot ${reservation.lotId} a été validé par le CGL.`,
          type: 'PAYMENT_VALIDATED',
          read: false,
          data: JSON.stringify({ reservationId: reservation.id, paymentId: payment.id, amount: payment.amount, lotId: reservation.lotId }),
        },
      });
    } catch (notificationError) {
      console.warn('Notification utilisateur non envoyée:', notificationError);
    }

    // Si le statut devient PAID, mettre à jour le lot
    if (newStatus === 'PAID') {
      await db.lot.update({
        where: { id: reservation.lotId },
        data: { status: 'PAID' },
      });

      // Check if user has already been congratulated for this lot
      const user = await db.user.findUnique({
        where: { id: reservation.userId },
      });

      if (user) {
        const congratulatedLots = user.congratulatedLots ? JSON.parse(user.congratulatedLots) : [];
        if (!congratulatedLots.includes(reservation.lotId)) {
          // User has not been congratulated yet, add lot to list
          congratulatedLots.push(reservation.lotId);
          await db.user.update({
            where: { id: reservation.userId },
            data: { congratulatedLots: JSON.stringify(congratulatedLots) },
          });
        }
      }
    } else if (newStatus === 'RESERVED' && reservation.lot.status === 'AVAILABLE') {
      await db.lot.update({
        where: { id: reservation.lotId },
        data: { status: 'RESERVED' },
      });
    }

    try {
      const [user, lot] = await Promise.all([
        db.user.findUnique({ where: { id: reservation.userId } }),
        db.lot.findUnique({ where: { id: reservation.lotId } }),
      ]);
      await notifyManagement({
        title: '💰 Paiement mis à jour',
        message: `${user?.name || 'Un souscripteur'} a versé ${newPaidAmount.toLocaleString('fr-FR')} F pour le lot ${lot?.name || reservation.lotId}.`,
        type: 'PAYMENT',
        data: {
          screen: 'payments',
          reservationId: reservation.id,
          userId: reservation.userId,
          userName: user?.name || 'Inconnu',
          lotId: reservation.lotId,
          lotName: lot?.name || '',
          amount: newPaidAmount,
          totalPrice: reservation.totalPrice,
          status: newStatus,
        },
      });
    } catch (notificationError) {
      console.warn('Notification paiement non envoyée:', notificationError);
    }

    return NextResponse.json(updatedReservation);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du paiement:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

// DELETE /api/admin/payments - Supprimer une réservation
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reservationId = searchParams.get('id');

    if (!reservationId) {
      return NextResponse.json({ error: 'ID réservation requis' }, { status: 400 });
    }

    // Récupérer la réservation avant suppression
    const reservation = await db.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      return NextResponse.json({ error: 'Réservation non trouvée' }, { status: 404 });
    }

    // Supprimer la réservation
    await db.reservation.delete({
      where: { id: reservationId },
    });

    // Remettre le lot en statut AVAILABLE
    await db.lot.update({
      where: { id: reservation.lotId },
      data: { status: 'AVAILABLE' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de la réservation:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
