import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Helper to get or create admin ID
async function getAdminId(): Promise<string> {
  let admin = await db.user.findFirst({
    where: { phone: 'ADMIN' },
  });

  if (!admin) {
    admin = await db.user.create({
      data: {
        name: 'Administrateur',
        phone: 'ADMIN',
        isResident: true,
      },
    });
  }

  return admin.id;
}

export async function POST(request: NextRequest) {
  try {
    const { content, receiverId, senderId } = await request.json();

    if (!content || !receiverId || !senderId) {
      return NextResponse.json({ error: 'Contenu, destinataire et expéditeur requis' }, { status: 400 });
    }

    // Verify sender exists
    const sender = await db.user.findUnique({
      where: { id: senderId },
    });

    if (!sender) {
      return NextResponse.json({ error: 'Expéditeur non trouvé' }, { status: 404 });
    }

    // Verify receiver exists (unless it's ADMIN phone)
    if (receiverId !== 'ADMIN') {
      const receiver = await db.user.findUnique({
        where: { id: receiverId },
      });

      if (!receiver) {
        return NextResponse.json({ error: 'Destinataire non trouvé' }, { status: 404 });
      }
    }

    // If receiver is ADMIN, get the admin user ID
    let finalReceiverId = receiverId;
    if (receiverId === 'ADMIN') {
      finalReceiverId = await getAdminId();
    }

    // Create message
    const message = await db.message.create({
      data: {
        content,
        senderId,
        receiverId: finalReceiverId,
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
    });

    // Notify committee/admin when a user sends a message to the admin inbox
    if (receiverId === 'ADMIN' || finalReceiverId === await getAdminId()) {
      const adminId = await getAdminId();
      const senderLabel = sender.name || sender.phone || 'Un utilisateur';
      await db.notification.create({
        data: {
          userId: adminId,
          title: 'Nouveau message',
          message: `${senderLabel} vous a envoyé : ${content}`,
          type: 'MESSAGE',
          read: false,
          data: JSON.stringify({
            senderId: sender.id,
            senderName: sender.name,
            senderPhone: sender.phone,
            messageId: message.id,
            content,
          }),
        },
      });
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'envoi du message' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 });
    }

    // Get admin ID
    const adminId = await getAdminId();

    // For admin view, userId is the target user
    // For user view, userId is the current user
    let whereClause: any = {};

    // Check if we're querying as admin or as user
    if (userId === adminId) {
      // Admin viewing all messages with any user - not supported in this simple version
      // Admin should use userId parameter to see conversation with specific user
      return NextResponse.json([]);
    } else {
      // User view or admin viewing specific conversation
      whereClause = {
        OR: [
          { senderId: userId, receiverId: adminId },
          { senderId: adminId, receiverId: userId },
        ],
      };
    }

    const messages = await db.message.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // If the user is receiver of admin messages, mark them as read
    const unreadMessages = messages.filter(
      m => m.receiverId === userId && !m.read
    );

    if (unreadMessages.length > 0) {
      await db.message.updateMany({
        where: {
          id: { in: unreadMessages.map(m => m.id) },
        },
        data: {
          read: true,
        },
      });
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des messages' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageIds } = body;

    if (!messageIds || !Array.isArray(messageIds)) {
      return NextResponse.json({ error: 'IDs de messages requis' }, { status: 400 });
    }

    // Mark messages as read
    await db.message.updateMany({
      where: {
        id: { in: messageIds },
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}