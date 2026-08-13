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

    // Get all payments for the user
    const payments = await db.payment.findMany({
      where: { userId: user.id },
      include: {
        lot: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Format payments for frontend
    const formattedPayments = payments.map(payment => ({
      id: payment.id,
      lotName: payment.lot.name,
      amount: payment.amount,
      status: payment.status,
      type: payment.type,
      createdAt: payment.createdAt.toISOString()
    }))

    return NextResponse.json(formattedPayments)
  } catch (error) {
    console.error('Error fetching user payments:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paiements' },
      { status: 500 }
    )
  }
}
