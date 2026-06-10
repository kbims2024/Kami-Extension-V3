import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { content, receiverId } = await request.json();

    // Get sender from session or create a default admin
    const senderId = 'ADMIN'; // In production, this would come from auth

    if (!content || !receiverId) {
      return NextResponse.json({ error: 'Contenu et destinataire requis' }, { status: 400 });
    }

    // Check if receiver exists
    let receiver = null;
    if (receiverId !== 'ADMIN') {
      receiver = await db.user.findUnique({
        where: { id: receiverId },
      });

      if (!receiver) {
        return NextResponse.json({ error: 'Destinataire non trouvé' }, { status: 404 });
      }
    }

    // Create message
    const message = await db.message.create({
      data: {
        content,
        senderId,
        receiverId,
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

    // Get all messages where user is either sender or receiver
    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
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
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

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