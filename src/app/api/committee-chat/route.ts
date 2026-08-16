import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { stripLegacyUserHeader } from '@/lib/chat-utils';

/**
 * GET /api/committee-chat
 * Récupère les conversations actives pour la vue CGL/Committee.
 * Retourne, pour chaque interlocuteur : ses infos, le dernier message,
 * la date du dernier message et le nombre de messages non lus.
 */
export async function GET() {
  try {
    const admin = await db.user.findFirst({
      where: { phone: 'ADMIN' },
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Administrateur non trouvé' },
        { status: 404 }
      );
    }

    // Tous les messages impliquant l'admin (hors discussions archivées)
    const allMessages = await db.message.findMany({
      where: {
        archivedAt: null,
        OR: [{ senderId: admin.id }, { receiverId: admin.id }],
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

    // Regroupement par interlocuteur (non-admin)
    const conversationMap = new Map<
      string,
      { userId: string; messages: any[] }
    >();

    for (const msg of allMessages) {
      const otherId = msg.senderId === admin.id ? msg.receiverId : msg.senderId;
      if (!otherId || otherId === admin.id) continue;

      if (!conversationMap.has(otherId)) {
        conversationMap.set(otherId, { userId: otherId, messages: [] });
      }
      conversationMap.get(otherId)!.messages.push(msg);
    }

    // Récupération des utilisateurs en une seule requête
    const userMap = new Map<string, any>();
    if (conversationMap.size > 0) {
      const users = await db.user.findMany({
        where: { id: { in: Array.from(conversationMap.keys()) } },
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
      users.forEach((u: any) => userMap.set(u.id, u));
    }

    const conversations = Array.from(conversationMap.values()).map((conv) => {
      const user = userMap.get(conv.userId);
      const lastMsg = conv.messages[conv.messages.length - 1];
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
        lastMessage: lastMsg
          ? {
              id: lastMsg.id,
              content: stripLegacyUserHeader(lastMsg.content),
              senderId: lastMsg.senderId,
              receiverId: lastMsg.receiverId,
              read: lastMsg.read,
              createdAt: lastMsg.createdAt,
            }
          : null,
        lastMessageAt: lastMsg?.createdAt || '',
        unreadCount,
      };
    });

    // Tri : non lus en priorité, puis par date récente
    conversations.sort((a, b) => {
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
      return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('[GET /api/committee-chat] Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des conversations' },
      { status: 500 }
    );
  }
}
