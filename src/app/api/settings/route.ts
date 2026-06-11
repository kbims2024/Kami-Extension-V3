import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Récupérer les paramètres (incluant l'image de fond)
export async function GET() {
  try {
    let settings = await prisma.settings.findFirst();

    // Si aucun paramètre n'existe, en créer un par défaut
    if (!settings) {
      settings = await prisma.settings.create({
        data: {},
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres' },
      { status: 500 }
    );
  }
}