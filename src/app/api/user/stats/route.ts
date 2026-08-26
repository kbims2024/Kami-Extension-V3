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

    // Calculate statistics
    const totalReserved = reservations.filter(r => r.status === 'RESERVED').length
    const totalPurchased = reservations.filter(r => r.status === 'PAID').length
    const totalPaid = reservations.reduce((sum, r) => sum + r.paidAmount, 0)
    
    const totalInvestment = reservations.reduce((sum, r) => sum + r.totalPrice, 0)
    const totalRemaining = totalInvestment - totalPaid

    // Calculate payment progress
    const paymentProgress = totalInvestment > 0 ? (totalPaid / totalInvestment) * 100 : 0

    // Calculate average progress per reservation
    let averageProgress = 0
    if (reservations.length > 0) {
      const progressSum = reservations.reduce((sum, r) => {
        return sum + ((r.paidAmount / r.totalPrice) * 100)
      }, 0)
      averageProgress = progressSum / reservations.length
    }

    const stats = {
      totalReserved,
      totalPurchased,
      totalPaid,
      totalRemaining,
      totalInvestment,
      averageProgress: Math.round(averageProgress * 10) / 10,
      totalAdvances: totalPaid,
      paymentProgress: Math.round(paymentProgress * 10) / 10
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}
