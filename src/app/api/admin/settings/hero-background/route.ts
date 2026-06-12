import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';

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

// POST - Mettre à jour l'image de fond du hero
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
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Le fichier est trop volumineux. Maximum 5MB' },
        { status: 400 }
      );
    }

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'hero');
    await mkdir(uploadsDir, { recursive: true });

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const ext = path.extname(file.name);
    const filename = `hero-bg-${timestamp}${ext}`;
    const filepath = path.join(uploadsDir, filename);

    // Sauvegarder le fichier
    await writeFile(filepath, buffer);

    // Récupérer ou créer les paramètres
    let settings = await db.settings.findFirst();
    if (!settings) {
      settings = await db.settings.create({
        data: {
          heroBackground: `/uploads/hero/${filename}`,
        },
      });
    } else {
      settings = await db.settings.update({
        where: { id: settings.id },
        data: {
          heroBackground: `/uploads/hero/${filename}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      heroBackground: settings.heroBackground,
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image:', error);
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement de l\'image' },
      { status: 500 }
    );
  }
}