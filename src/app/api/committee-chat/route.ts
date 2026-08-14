import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/committee-chat — returns all conversations grouped by user
// Each group has the user's info (initiative) + their messages
export async function GET() {
  try {
    const adminId = await getAdminId();

    const adminKeys = [adminId, 'ADMIN'];

    // Get all messages involving the admin (committee)
    const allMessages = await db.message.findMany({
      where: {
        OR: [
          { senderId: { in: adminKeys } },
          { receiverId: { in: adminKeys } },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group messages by user (excluding admin)
    const userGroups: Record<string, { user: any; messages: any[] }> = {};

    for (const msg of allMessages) {
      // Determine the other party (non-admin)
      const otherId = adminKeys.includes(msg.senderId) ? msg.receiverId : msg.senderId;
      if (!otherId || adminKeys.includes(otherId)) continue;

      if (!userGroups[otherId]) {
        // Fetch full user info for the initiative card
        const fullUser = await db.user.findUnique({
          where: { id: otherId },
        });
        userGroups[otherId] = {
          user: fullUser
            ? {
                id: fullUser.id,
                name: fullUser.name,
                phone: fullUser.phone,
                email: fullUser.email || null,
                isResident: fullUser.isResident,
                role: fullUser.role || null,
                quartier: fullUser.quartier || null,
                villageOrigine: fullUser.villageOrigine || null,
                createdAt: fullUser.createdAt,
              }
            : {
                id: otherId,
                name: msg.sender?.name || msg.receiver?.name || 'Inconnu',
                phone: msg.sender?.phone || msg.receiver?.phone || '',
                email: null,
                isResident: false,
                role: null,
                quartier: null,
                villageOrigine: null,
                createdAt: msg.createdAt,
              },
          messages: [],
        };
      }
      userGroups[otherId].messages.push(msg);
    }

    // Convert to array, sorted by priority (unread first, then most recent)
    const conversations = Object.values(userGroups).map((group) => ({
      ...group,
      lastMessageAt: group.messages[group.messages.length - 1]?.createdAt || '',
      unreadCount: group.messages.filter(
        (m) => m.senderId !== adminId && !m.read
      ).length,
    }));

    conversations.sort((a, b) => {
      // Prioritize unread
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
      // Then sort by date
      return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching committee chat:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

async function getAdminId(): Promise<string> {
  let admin = await db.user.findFirst({ where: { phone: 'ADMIN' } });
  if (!admin) {
    admin = await db.user.create({
      data: { name: 'Administrateur', phone: 'ADMIN', isResident: true },
    });
  }
  return admin.id;
}
