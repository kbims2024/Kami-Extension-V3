import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/committee-chat
 * Récupère toutes les conversations pour la vue CGL/Committee
 * Retourne une liste des utilisateurs qui ont des conversations + leurs messages
 */
export async function GET() {
  try {
    console.log('[GET /api/committee-chat] Récupération des conversations');

    // Récupérer l'admin
    const admin = await db.user.findFirst({
      where: { phone: 'ADMIN' },
    });

    if (!admin) {
      console.error('[GET /api/committee-chat] Admin not found');
      return NextResponse.json(
        { error: 'Administrateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer tous les messages impliquant l'admin
    const allMessages = await db.message.findMany({
      where: {
        OR: [
          { senderId: admin.id },
          { receiverId: admin.id },
        ],
      },
      select: {
        id: true,
        content: true,
        senderId: true,
        receiverId: true,
        read: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    console.log('[GET /api/committee-chat] Messages trouvés:', allMessages.length);

    // Grouper par utilisateur (non-admin)
    const conversationMap = new Map<
      string,
      {
        userId: string;
        messages: any[];
      }
    >();

    for (const msg of allMessages) {
      const otherId = msg.senderId === admin.id ? msg.receiverId : msg.senderId;

      if (!otherId || otherId === admin.id) continue;

      if (!conversationMap.has(otherId)) {
        conversationMap.set(otherId, { userId: otherId, messages: [] });
      }

      conversationMap.get(otherId)!.messages.push(msg);
    }

    // Enrichir avec infos utilisateur
    const conversations = await Promise.all(
      Array.from(conversationMap.values()).map(async (conv) => {
        const user = await db.user.findUnique({
          where: { id: conv.userId },
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            isResident: true,
            role: true,
            quartier: true,
            villageOrigine: true,
            createdAt: true,
          },
        });

        const unreadCount = conv.messages.filter(
          (m) => m.senderId !== admin.id && !m.read
        ).length;

        return {
          user: user || {
            id: conv.userId,
            name: 'Utilisateur inconnu',
            phone: '',
            email: null,
            isResident: false,
            role: null,
            quartier: null,
            villageOrigine: null,
            createdAt: new Date().toISOString(),
          },
          messages: conv.messages,
          lastMessageAt: conv.messages[conv.messages.length - 1]?.createdAt || '',
          unreadCount,
        };
      })
    );

    // Trier: messages non lus en priorité, puis par date récente
    conversations.sort((a, b) => {
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
      return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
    });

    console.log('[GET /api/committee-chat] Retour:', conversations.length, 'conversations');

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('[GET /api/committee-chat] Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des conversations' },
      { status: 500 }
    );
  }
}
