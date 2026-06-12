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
      data: { role: 'MANAGEMENT_COMMITTEE' },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true
      }
    });

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