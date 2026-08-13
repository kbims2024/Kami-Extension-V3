export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Récupérer tous les membres du comité de gestion
export async function GET() {
  try {
    const committeeMembers = await db.user.findMany({
      where: {
        role: 'MANAGEMENT_COMMITTEE',
        status: 'ACTIVE'
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(committeeMembers);
  } catch (error) {
    console.error('Error fetching committee members:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des membres' },
      { status: 500 }
    );
  }
}

// POST - Ajouter un membre au comité de gestion
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'ID utilisateur requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Mettre à jour le rôle de l'utilisateur
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        role: 'MANAGEMENT_COMMITTEE',
        committeeAddedAt: new Date().toISOString(),
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true
      }
    });

    // Envoyer un message de bienvenue de l'admin au nouveau membre
    try {
      let admin = await db.user.findFirst({ where: { phone: 'ADMIN' } });
      if (!admin) {
        admin = await db.user.create({
          data: { name: 'Administrateur', phone: 'ADMIN', isResident: true },
        });
      }

      const welcomeMessage =
        `👋 Bienvenue dans le Comité de Gestion des Lots de KAMI-EXTENSION !\n\n` +
        `Cher(e) ${user.name},\n\n` +
        `Nous sommes ravis de vous compter parmi les membres du Comité de Gestion des Lots (CGL). ` +
        `Votre rôle est essentiel pour le bon fonctionnement et la transparence de la gestion de notre village.\n\n` +
        `📁 Vos attributions principales :\n` +
        `• Valider les paiements des souscripteurs\n` +
        `• Gérer les lots disponibles\n` +
        `• Répondre aux questions des résidents\n` +
        `• Suivre l'avancement des travaux\n\n` +
        `N'hésitez pas à consulter l'Espace CGL pour accéder à vos outils de gestion.\n\n` +
        `Cordialement,\nLe Comité de Gestion KAMI-EXTENSION`;

      await db.message.create({
        data: {
          content: welcomeMessage,
          senderId: admin.id,
          receiverId: userId,
        },
      });
    } catch (msgErr) {
      console.error('Could not send welcome message:', msgErr);
      // Non-bloquant : le membre est déjà ajouté même si le message échoue
    }

    return NextResponse.json({
      message: 'Utilisateur ajouté au comité de gestion',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error adding committee member:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout du membre' },
      { status: 500 }
    );
  }
}

// DELETE - Retirer un membre du comité de gestion
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'ID utilisateur requis' },
        { status: 400 }
      );
    }

    // Mettre à jour le rôle de l'utilisateur
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { role: 'USER' },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true
      }
    });

    return NextResponse.json({
      message: 'Utilisateur retiré du comité de gestion',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error removing committee member:', error);
    return NextResponse.json(
      { error: 'Erreur lors du retrait du membre' },
      { status: 500 }
    );
  }
}
