import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get total lots by status
    const allLots = await db.lot.findMany()
    const totalLots = allLots.length
    const availableLots = allLots.filter(l => l.status === 'AVAILABLE').length
    const reservedLots = allLots.filter(l => l.status === 'RESERVED').length
    const paidLots = allLots.filter(l => l.status === 'PAID').length

    // Get users statistics
    const allUsers = await db.user.findMany()
    const totalUsers = allUsers.length
    const activeUsers = allUsers.filter(u => u.status === 'ACTIVE').length

    // Get all reservations
    const allReservations = await db.reservation.findMany({
      include: {
        lot: true,
        user: true
      }
    })

    // Get all payments
    const allPayments = await db.payment.findMany({
      include: {
        lot: true,
        user: true
      }
    })

    const validatedPayments = allPayments.filter(p => p.status === 'VALIDATED')
    const pendingPayments = allPayments.filter(p => p.status === 'PENDING').length
    const totalRevenue = validatedPayments.reduce((sum, p) => sum + p.amount, 0)

    // Calculate statistics for current month
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const reservationsThisMonth = allReservations.filter(r => {
      const date = new Date(r.createdAt)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    }).length

    const paymentsThisMonth = validatedPayments.filter(p => {
      const date = new Date(p.createdAt)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    }).length

    // Calculate average payment per user (users with payments only)
    const usersWithPayments = new Set(validatedPayments.map(p => p.userId))
    const averagePaymentPerUser = usersWithPayments.size > 0 
      ? totalRevenue / usersWithPayments.size 
      : 0

    // Calculate occupancy rate
    const occupancyRate = totalLots > 0 ? ((reservedLots + paidLots) / totalLots) * 100 : 0

    const stats = {
      totalLots,
      availableLots,
      reservedLots,
      paidLots,
      totalUsers,
      activeUsers,
      totalRevenue,
      pendingPayments,
      reservationsThisMonth,
      paymentsThisMonth,
      averagePaymentPerUser: Math.round(averagePaymentPerUser),
      occupancyRate: Math.round(occupancyRate * 10) / 10
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}