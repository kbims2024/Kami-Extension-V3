import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Helper: convert a File to a base64 data URI
function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

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

// POST - Mettre à jour l'image de fond du hero (store as base64 in Settings)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Valider le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non supporté. Utilisez JPG, PNG ou WebP' },
        { status: 400 }
      );
    }

    // Valider la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Le fichier est trop volumineux. Maximum 5MB' },
        { status: 400 }
      );
    }

    // Convert file to base64 data URI
    const dataUri = await fileToDataUri(file);

    // Récupérer ou créer les paramètres
    let settings = await db.settings.findFirst();
    if (!settings) {
      settings = await db.settings.create({
        data: {
          heroBackground: dataUri,
        },
      });
    } else {
      const settingsId = settings.id!;
      settings = await db.settings.update({
        where: { id: settingsId },
        data: {
          heroBackground: dataUri,
        },
      });
    }

    return NextResponse.json({
      success: true,
      heroBackground: settings.heroBackground,
    });
  } catch (error) {
    console.error("Erreur lors du téléchargement de l'image:", error);
    return NextResponse.json(
      { error: "Erreur lors du téléchargement de l'image" },
      { status: 500 }
    );
  }
}
