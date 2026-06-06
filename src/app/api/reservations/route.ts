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
