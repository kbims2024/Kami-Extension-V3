export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from query or session
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    // For now, use the first active user if no userId provided
    // In production, this should come from authentication session
    let user
    if (userId) {
      user = await db.user.findUnique({
        where: { id: userId }
      })
    } else {
      user = await db.user.findFirst({
        where: { status: 'ACTIVE' }
      })
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Get all reservations for the user
    const reservations = await db.reservation.findMany({
      where: { userId: user.id },
      include: {
        lot: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Format reservations for frontend
    const formattedReservations = reservations.map(reservation => ({
      id: reservation.id,
      lotName: reservation.lot.name,
      block: reservation.lot.block,
      surface: reservation.lot.surface,
      totalPrice: reservation.totalPrice,
      paidAmount: reservation.paidAmount,
      status: reservation.status,
      createdAt: reservation.createdAt.toISOString()
    }))

    return NextResponse.json(formattedReservations)
  } catch (error) {
    console.error('Error fetching user reservations:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des réservations' },
      { status: 500 }
    )
  }
}
