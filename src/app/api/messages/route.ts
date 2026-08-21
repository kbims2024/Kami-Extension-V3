import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { connectDB } from '@/lib/mongodb';
import { Settings } from '@/lib/models/Settings';
import { ensureAdmin } from '@/lib/admin';
import { MAX_MESSAGE_LENGTH, stripLegacyUserHeader } from '@/lib/chat-utils';
import { normalizeDiscussionConfig } from '@/lib/discussion-config';

let cachedAdminId: string | null = null;

async function getAdminId(): Promise<string> {
  if (cachedAdminId) {
    return cachedAdminId;
  }
  const admin = await ensureAdmin();
  cachedAdminId = admin.id; // Cache the ID
  return admin.id;
}

/** Récupère les infos publiques d'un ensemble d'utilisateurs en une seule requête. */
async function getUsersInfo(ids: string[]) {
  const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
  if (uniqueIds.length === 0) return new Map<string, any>();

  const users = await db.user.findMany({
    where: { id: { in: uniqueIds } },
    select: {
      id: true,
      name: true,
      phone: true,
    },
  });

  return new Map(users.map((u: any) => [u.id, u]));
}

/**
 * POST /api/messages
 * Envoyer un message (texte et/ou pièce jointe audio).
 * Body: { content?: string, receiverId: string, senderId: string,
 *         attachment?: { type: 'audio', url, mimeType, size, duration?, name? } }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, receiverId, senderId, attachment } = body;

    const cleanContent = (content || '').trim();

    if (!cleanContent && !attachment) {
      return NextResponse.json(
        { error: 'Le contenu du message est obligatoire' },
        { status: 400 }
      );
    }

    if (cleanContent.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Le message ne peut pas dépasser ${MAX_MESSAGE_LENGTH} caractères` },
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

    const [sender, receiver] = await Promise.all([
      db.user.findUnique({
        where: { id: senderId },
        select: { id: true, name: true, phone: true },
      }),
      db.user.findUnique({
        where: { id: receiverId },
        select: { id: true, name: true, phone: true },
      }),
    ]);

    if (!sender) {
      return NextResponse.json(
        { error: 'Expéditeur non trouvé' },
        { status: 404 }
      );
    }

    if (!receiver) {
      return NextResponse.json(
        { error: 'Destinataire non trouvé' },
        { status: 404 }
      );
    }

    const message = await db.message.create({
      data: {
        content: cleanContent || attachment?.name || 'Message vocal',
        senderId,
        receiverId,
        read: false,
        attachment: attachment || null,
      },
    });

    // ─── Réponse automatique du CGL ───
    // Si l'utilisateur écrit au CGL pour la première fois et qu'une réponse
    // automatique est configurée, on la crée depuis l'admin (comptée comme
    // non lue pour l'utilisateur).
    if (senderId !== receiverId) {
      const admin = await ensureAdmin();
      const isAdmin = admin && (senderId === admin.id || receiverId === admin.id);
      if (!isAdmin) {
        const threadCount = await db.message.count({
          where: {
            OR: [
              { senderId, receiverId },
              { senderId: receiverId, receiverId: senderId },
            ],
          },
        });

        if (threadCount === 1) {
          try {
            await connectDB();
            let settings: any = await Settings.findById('settings-default').lean();
            if (!settings) settings = await Settings.findOne().lean();
            const autoReply = normalizeDiscussionConfig(settings?.discussionConfig).autoReply;

            if (autoReply && admin) {
              await db.message.create({
                data: {
                  content: autoReply,
                  senderId: admin.id,
                  receiverId: senderId,
                  read: false,
                },
              });
            }
          } catch (e) {
            console.error('[POST /api/messages] Auto-reply error:', e);
          }
        }
      }
    }

    return NextResponse.json({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      receiverId: message.receiverId,
      read: message.read,
      attachment: message.attachment || null,
      createdAt: message.createdAt,
      sender: { id: sender.id, name: sender.name, phone: sender.phone },
      receiver: { id: receiver.id, name: receiver.name, phone: receiver.phone },
    });
  } catch (error) {
    console.error('[POST /api/messages] Erreur:', error);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/messages?userId=X[&otherUserId=Y][&markRead=true]
 * Récupère les messages d'un fil de discussion.
 * - `markRead=true` : marque comme lus les messages reçus par `userId`
 *   (accusé de lecture des deux côtés : utilisateur et CGL).
 * Le contenu est nettoyé de l'ancien en-tête texte hérité.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const otherUserId = searchParams.get('otherUserId');
    const markRead = searchParams.get('markRead') === 'true' || searchParams.get('markAdminAsRead') === 'true';

    if (!userId) {
      return NextResponse.json(
        { error: 'ID utilisateur requis' },
        { status: 400 }
      );
    }

    const admin = await ensureAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: 'Administrateur non trouvé' },
        { status: 404 }
      );
    }

    // Cas 1 : le demandeur est l'admin -> fil avec un utilisateur précis
    let markReadWhere: any = null;
    let whereClause: any = {};

    if (userId === admin.id) {
      if (!otherUserId) {
        return NextResponse.json(
          { error: 'otherUserId requis pour admin' },
          { status: 400 }
        );
      }
      whereClause = {
        archivedAt: null,
        OR: [
          { senderId: admin.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: admin.id },
        ],
      };
      markReadWhere = { receiverId: admin.id, senderId: otherUserId, read: false };
    }
    // Cas 2 : utilisateur lambda -> fil avec l'admin
    else {
      whereClause = {
        archivedAt: null,
        OR: [
          { senderId: userId, receiverId: admin.id },
          { senderId: admin.id, receiverId: userId },
        ],
      };
      markReadWhere = { receiverId: userId, senderId: admin.id, read: false };
    }


    if (markRead && markReadWhere) {
      await db.message.updateMany({
        where: markReadWhere,
        data: { read: true },
      });
    }

    const messages = await db.message.findMany({
      where: whereClause,
      select: {
        id: true,
        content: true,
        senderId: true,
        receiverId: true,
        read: true,
        attachment: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Enrichissement en masse (une seule requête pour les expéditeurs/destinataires)
    const ids: string[] = [];
    messages.forEach((msg: any) => {
      ids.push(msg.senderId, msg.receiverId);
    });
    const userMap = await getUsersInfo(ids);

    const enrichedMessages = messages.map((msg: any) => ({
      ...msg,
      content: stripLegacyUserHeader(msg.content),
      attachment: msg.attachment || null,
      sender: userMap.get(msg.senderId) || { id: msg.senderId, name: 'Inconnu', phone: '' },
      receiver: userMap.get(msg.receiverId) || { id: msg.receiverId, name: 'Inconnu', phone: '' },
    }));

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
    const { messageIds, action, userId } = body;

    if (action === 'archiveConversation' && userId) {
      const adminId = await getAdminId();
      await db.message.updateMany({
        where: {
          OR: [
            { senderId: userId, receiverId: adminId },
            { senderId: adminId, receiverId: userId },
          ],
        },
        data: {
          archivedAt: new Date(),
        },
      });
      return NextResponse.json({ success: true, message: 'Conversation archivée' });
    }

    if (action === 'deleteConversation' && userId) {
      const adminId = await getAdminId();
      await db.message.deleteMany({
        where: {
          OR: [
            { senderId: userId, receiverId: adminId },
            { senderId: adminId, receiverId: userId },
          ],
        },
      });
      return NextResponse.json({ success: true, message: 'Conversation supprimée' });
    }

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
    const userId = searchParams.get('userId');

    if (messageId) {
      await db.message.delete({
        where: { id: messageId },
      });
      return NextResponse.json({ success: true, message: 'Message supprimé' });
    }

    if (userId) {
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

    return NextResponse.json({ error: "ID de message ou d'utilisateur requis" }, { status: 400 });
  } catch (error) {
    console.error('Error deleting messages:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
