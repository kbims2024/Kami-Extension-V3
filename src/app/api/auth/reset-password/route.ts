import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/password'

export async function POST(request: NextRequest) {
  try {
    const { phone, password, resetToken } = await request.json()

    if (!phone || !password || !resetToken) {
      return NextResponse.json(
        { error: 'Numéro de téléphone, mot de passe et code de réinitialisation requis' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    // Find user by phone
    const user = await db.user.findUnique({
      where: { phone }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Verify reset token
    if (!user.resetToken || user.resetToken !== resetToken) {
      return NextResponse.json(
        { error: 'Code de réinitialisation invalide' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (!user.resetTokenExpires || new Date() > user.resetTokenExpires) {
      return NextResponse.json(
        { error: 'Code de réinitialisation expiré' },
        { status: 400 }
      )
    }

    // Hash and update password
    const hashedPassword = hashPassword(password)

    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la réinitialisation du mot de passe' },
      { status: 500 }
    )
  }
}