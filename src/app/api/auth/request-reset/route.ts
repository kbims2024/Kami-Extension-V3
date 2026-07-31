import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateResetToken } from '@/lib/password';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Numéro de téléphone requis' },
        { status: 400 }
      );
    }

    // Find user by phone
    const user = await db.user.findUnique({
      where: { phone }
    });

    if (!user) {
      // For security, don't reveal that user doesn't exist
      // But return a success message anyway
      return NextResponse.json({
        success: true,
        message: 'Si ce numéro est associé à un compte, vous recevrez un code de réinitialisation'
      });
    }

    // Generate reset token valid for 1 hour
    const resetToken = generateResetToken();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Update user with reset token
    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires
      }
    });

    // In a real application, you would send the token via SMS or email here
    // For demo purposes, we'll include it in the response (INSECURE - only for development)
    // In production, remove the token from the response and send it via SMS/email
    return NextResponse.json({
      success: true,
      message: 'Code de réinitialisation envoyé',
      // ⚠️ SECURITY WARNING: Remove this token in production
      // This is only included for demonstration purposes
      resetToken: resetToken
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la demande de réinitialisation' },
      { status: 500 }
    );
  }
}