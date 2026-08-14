import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateResetToken } from '@/lib/password';

export async function POST(request: NextRequest) {
  try {
    const { phone, pseudo } = await request.json();

    if (!phone && !pseudo) {
      return NextResponse.json(
        { error: 'Pseudo ou numéro de téléphone requis' },
        { status: 400 }
      );
    }

    // Find user by pseudo or phone
    let user: any = null;
    if (pseudo) {
      user = await db.user.findUnique({ where: { pseudo } });
    } else if (phone) {
      user = await db.user.findUnique({ where: { phone } });
    }

    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'Si cet identifiant est associé à un compte, vous recevrez un code de réinitialisation'
      });
    }

    const resetToken = generateResetToken();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    await db.user.update({
      where: { id: (user as any).id },
      data: { resetToken, resetTokenExpires }
    });

    return NextResponse.json({
      success: true,
      message: 'Code de réinitialisation envoyé',
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
