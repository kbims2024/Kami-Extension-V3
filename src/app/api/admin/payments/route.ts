import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
    const { reservationId, amount, status } = body;

    if (!reservationId) {
      return NextResponse.json({ error: 'ID réservation requis' }, { status: 400 });
    }

    const reservation = await db.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      return NextResponse.json({ error: 'Réservation non trouvée' }, { status: 404 });
    }

    // Calculer le nouveau montant payé
    const newPaidAmount = amount !== undefined ? amount : reservation.paidAmount;

    // Déterminer le nouveau statut
    let newStatus = status;
    if (!newStatus) {
      if (newPaidAmount >= reservation.totalPrice) {
        newStatus = 'PAID';
      } else if (newPaidAmount > 0) {
        newStatus = 'RESERVED';
      }
    }

    // Mettre à jour la réservation
    const updatedReservation = await db.reservation.update({
      where: { id: reservationId },
      data: {
        paidAmount: newPaidAmount,
        status: newStatus,
      },
    });

    // Si le statut devient PAID, mettre à jour le lot
    if (newStatus === 'PAID') {
      await db.lot.update({
        where: { id: reservation.lotId },
        data: { status: 'PAID' },
      });
    } else if (newStatus === 'RESERVED' && reservation.lot.status === 'AVAILABLE') {
      await db.lot.update({
        where: { id: reservation.lotId },
        data: { status: 'RESERVED' },
      });
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