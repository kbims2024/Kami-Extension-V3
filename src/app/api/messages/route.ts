import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Helper to get or create admin ID
async function getAdminId(): Promise<string> {
  try {
    let admin = await db.user.findFirst({
      where: { phone: 'ADMIN' },
    });

    if (!admin) {
      console.log('Admin user not found, creating...');
      admin = await db.user.create({
        data: {
          name: 'Administrateur',
          phone: 'ADMIN',
          isResident: true,
        },
      });
      console.log('Admin user created:', admin.id);
    } else {
      console.log('Admin user found:', admin.id);
    }

    return admin.id;
  } catch (error) {
    console.error('Error in getAdminId:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, receiverId, senderId } = await request.json();

    if (!content || !receiverId || !senderId) {
      console.error('Missing required fields:', { content: !!content, receiverId, senderId });
      return NextResponse.json({ error: 'Contenu, destinataire et expéditeur requis' }, { status: 400 });
    }

    // Verify sender exists
    const sender = await db.user.findUnique({
      where: { id: senderId },
    });

    if (!sender) {
      console.error('Sender not found:', senderId);
      return NextResponse.json({ error: 'Expéditeur non trouvé' }, { status: 404 });
    }

    // Verify receiver exists (unless it's ADMIN phone)
    if (receiverId !== 'ADMIN') {
      const receiver = await db.user.findUnique({
        where: { id: receiverId },
      });

      if (!receiver) {
        console.error('Receiver not found:', receiverId);
        return NextResponse.json({ error: 'Destinataire non trouvé' }, { status: 404 });
      }
    }

    // If receiver is ADMIN, get the admin user ID
    let finalReceiverId = receiverId;
    if (receiverId === 'ADMIN') {
      console.log('Getting or creating admin user...');
      try {
        finalReceiverId = await getAdminId();
        console.log('Admin ID resolved to:', finalReceiverId);
      } catch (adminError) {
        console.error('Error getting admin ID:', adminError);
        return NextResponse.json({ error: 'Erreur lors de la récupération de l\'administrateur' }, { status: 500 });
      }
    }

    // Create message
    console.log('Creating message:', { content, senderId, receiverId: finalReceiverId });
    const message = await db.message.create({
      data: {
        content,
        senderId,
        receiverId: finalReceiverId,
      },
    });

    console.log('Message created:', message.id);

    // Populate sender and receiver fields manually
    const senderData = await db.user.findUnique({
      where: { id: senderId },
      select: { id: true, name: true, phone: true },
    });

    const receiverData = await db.user.findUnique({
      where: { id: finalReceiverId },
      select: { id: true, name: true, phone: true },
    });

    return NextResponse.json({
      ...message,
      sender: senderData,
      receiver: receiverData,
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'envoi du message: ' + String(error) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 });
    }

    // Get admin ID and support legacy ADMIN string
    const adminId = await getAdminId();
    const adminKeys = [adminId, 'ADMIN'];

    // For admin view, userId is the target user
    // For user view, userId is the current user
    let whereClause: any = {};

    if (userId === adminId || userId === 'ADMIN') {
      // Admin viewing all messages with any user is not supported here.
      return NextResponse.json([]);
    } else {
      whereClause = {
        OR: [
          { senderId: userId, receiverId: { in: adminKeys } },
          { senderId: { in: adminKeys }, receiverId: userId },
        ],
      };
    }

    let messages = await db.message.findMany({
      where: whereClause,
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
      orderBy: {
        createdAt: 'asc',
      },
    });

    const markAdminAsRead = searchParams.get('markAdminAsRead') === 'true';

    if (markAdminAsRead && userId !== adminId && userId !== 'ADMIN') {
      const unreadMessages = messages.filter(
        (m) => adminKeys.includes(m.receiverId) && m.senderId === userId && !m.read
      );

      if (unreadMessages.length > 0) {
        await db.message.updateMany({
          where: {
            id: { in: unreadMessages.map((m) => m.id) },
          },
          data: {
            read: true,
          },
        });

        const unreadIds = new Set(unreadMessages.map((m) => m.id));
        messages = messages.map((m) =>
          unreadIds.has(m.id) ? { ...m, read: true } : m
        );
      }
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');
    const userId = searchParams.get('userId'); // For deleting entire conversation

    if (messageId) {
      // Delete single message
      await db.message.delete({
        where: { id: messageId },
      });
      return NextResponse.json({ success: true, message: 'Message supprimé' });
    }

    if (userId) {
      // Delete entire conversation with this user
      const adminId = await getAdminId();
      const adminKeys = [adminId, 'ADMIN'];

      await db.message.deleteMany({
        where: {
          OR: [
            { senderId: userId, receiverId: { in: adminKeys } },
            { senderId: { in: adminKeys }, receiverId: userId },
          ],
        },
      });
      return NextResponse.json({ success: true, message: 'Conversation supprimée' });
    }

    return NextResponse.json({ error: 'ID de message ou d\'utilisateur requis' }, { status: 400 });
  } catch (error) {
    console.error('Error deleting messages:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}

