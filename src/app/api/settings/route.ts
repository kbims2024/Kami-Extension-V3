export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Récupérer les paramètres (incluant l'image de fond)
export async function GET() {
  try {
    let settings = await db.settings.findFirst();

    // Si aucun paramètre n'existe, en créer un par défaut
    if (!settings) {
      settings = await db.settings.create({
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
