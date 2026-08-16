import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ensureAdmin } from '@/lib/admin';

/**
 * GET /api/messages/unread?userId=X
 * Nombre de messages du CGL non lus par l'utilisateur X.
 * Utilisé pour afficher le badge « Discussions » dans le menu.
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'ID utilisateur requis' },
        { status: 400 }
      );
    }

    const admin = await ensureAdmin();

    if (!admin) {
      return NextResponse.json({ unreadCount: 0 });
    }

    const unreadCount = await db.message.count({
      where: {
        senderId: admin.id,
        receiverId: userId,
        read: false,
        archivedAt: null,
      },
    });

    return NextResponse.json({ unreadCount });
  } catch (error) {
    console.error('[GET /api/messages/unread] Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors du calcul des messages non lus' },
      { status: 500 }
    );
  }
}
