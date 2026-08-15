import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

async function getAdminId(): Promise<string> {
  const admin = await db.user.findFirst({
    where: { phone: 'ADMIN' },
  });

  if (admin) {
    return admin.id;
  }

  const created = await db.user.create({
    data: {
      name: 'Administrateur',
      phone: 'ADMIN',
      isResident: true,
    },
  });

  return created.id;
}

/**
 * POST /api/messages
 * Envoyer un message
 * Body: { content: string, receiverId: string, senderId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, receiverId, senderId } = body;

    // Validation
    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Le contenu du message est obligatoire' },
        { status: 400 }
      );
    }

    if (!senderId) {
      return NextResponse.json(
        { error: 'ID expéditeur obligatoire' },
        { status: 400 }
      );
    }

    if (!receiverId) {
      return NextResponse.json(
        { error: 'ID destinataire obligatoire' },
        { status: 400 }
      );
    }

    console.log('[POST /api/messages]', { content: content.substring(0, 50), senderId, receiverId });

    // Vérifier l'expéditeur
    const sender = await db.user.findUnique({
      where: { id: senderId },
      select: { id: true, name: true, phone: true },
    });

    if (!sender) {
      console.error('[POST] Expéditeur non trouvé:', senderId);
      return NextResponse.json(
        { error: 'Expéditeur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier le destinataire
    const receiver = await db.user.findUnique({
      where: { id: receiverId },
      select: { id: true, name: true, phone: true },
    });

    if (!receiver) {
      console.error('[POST] Destinataire non trouvé:', receiverId);
      return NextResponse.json(
        { error: 'Destinataire non trouvé' },
        { status: 404 }
      );
    }

    // Créer le message
    const message = await db.message.create({
      data: {
        content: content.trim(),
        senderId,
        receiverId,
        read: false,
      },
    });

    console.log('[POST] Message créé:', message.id);

    return NextResponse.json({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      receiverId: message.receiverId,
      read: message.read,
      createdAt: message.createdAt,
      sender: {
        id: sender.id,
        name: sender.name,
        phone: sender.phone,
      },
      receiver: {
        id: receiver.id,
        name: receiver.name,
        phone: receiver.phone,
      },
    });
  } catch (error) {
    console.error('[POST /api/messages] Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'envoi du message' },
      { status: 500 }
    );
  }
}


/**
 * GET /api/messages?userId=X
 * Récupérer les messages avec un utilisateur spécifique
 * Pour les utilisateurs: récupère les messages avec l'ADMIN
 * Pour l'ADMIN: récupère les messages avec un utilisateur spécifique
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const otherUserId = searchParams.get('otherUserId'); // Pour admin regardant un utilisateur spécifique

    if (!userId) {
      return NextResponse.json(
        { error: 'ID utilisateur requis' },
        { status: 400 }
      );
    }

    console.log('[GET /api/messages]', { userId, otherUserId });

    // Récupérer l'admin
    const admin = await db.user.findFirst({
      where: { phone: 'ADMIN' },
    });

    if (!admin) {
      console.error('[GET] Admin user not found');
      return NextResponse.json(
        { error: 'Administrateur non trouvé' },
        { status: 404 }
      );
    }

    let whereClause: any = {};

    // Cas 1: L'utilisateur courant est l'admin -> cherche les messages avec otherUserId
    if (userId === admin.id) {
      if (!otherUserId) {
        return NextResponse.json(
          { error: 'otherUserId requis pour admin' },
          { status: 400 }
        );
      }
      whereClause = {
        OR: [
          { senderId: admin.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: admin.id },
        ],
      };
    }
    // Cas 2: L'utilisateur courant est un user lambda -> cherche les messages avec l'admin
    else {
      whereClause = {
        OR: [
          { senderId: userId, receiverId: admin.id },
          { senderId: admin.id, receiverId: userId },
        ],
      };
    }

    const messages = await db.message.findMany({
      where: whereClause,
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

    // Récupérer les infos sender/receiver
    const enrichedMessages = await Promise.all(
      messages.map(async (msg) => {
        const sender = await db.user.findUnique({
          where: { id: msg.senderId },
          select: { id: true, name: true, phone: true },
        });
        const receiver = await db.user.findUnique({
          where: { id: msg.receiverId },
          select: { id: true, name: true, phone: true },
        });
        return {
          ...msg,
          sender: sender || { id: msg.senderId, name: 'Inconnu', phone: '' },
          receiver: receiver || { id: msg.receiverId, name: 'Inconnu', phone: '' },
        };
      })
    );

    return NextResponse.json(enrichedMessages);
  } catch (error) {
    console.error('[GET /api/messages] Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des messages' },
      { status: 500 }
    );
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

