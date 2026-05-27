import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // ex: 'PLAN'

    if (!file || !type) {
      return NextResponse.json({ error: 'Fichier ou type manquant' }, { status: 400 });
    }

    // Vérifier que c'est un PDF ou PNG
    const validMimeTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Type de fichier non supporté (PDF, PNG ou JPEG requis)' }, { status: 400 });
    }

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${type}_${timestamp}_${originalName}`;
    const filepath = join(uploadsDir, filename);

    // Écrire le fichier
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Mettre à jour ou créer l'entrée dans la base de données
    const existingFile = await db.adminFile.findUnique({
      where: { type },
    });

    let adminFile;
    if (existingFile) {
      // Supprimer l'ancien fichier
      try {
        const oldPath = join(process.cwd(), 'public', existingFile.path);
        if (existsSync(oldPath)) {
          await (await import('fs/promises')).unlink(oldPath);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'ancien fichier:', error);
      }

      // Mettre à jour l'entrée
      adminFile = await db.adminFile.update({
        where: { type },
        data: {
          filename,
          path: `/uploads/${filename}`,
          mimeType: file.type,
          size: file.size,
          updatedAt: new Date(),
        },
      });
    } else {
      // Créer une nouvelle entrée
      adminFile = await db.adminFile.create({
        data: {
          type,
          filename,
          path: `/uploads/${filename}`,
          mimeType: file.type,
          size: file.size,
        },
      });
    }

    return NextResponse.json({
      success: true,
      file: adminFile,
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    if (!type) {
      return NextResponse.json({ error: 'Type manquant' }, { status: 400 });
    }

    const file = await db.adminFile.findUnique({
      where: { type },
    });

    if (!file) {
      return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ file });
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    if (!type) {
      return NextResponse.json({ error: 'Type manquant' }, { status: 400 });
    }

    const file = await db.adminFile.findUnique({
      where: { type },
    });

    if (!file) {
      return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 });
    }

    // Supprimer le fichier physique
    const filepath = join(process.cwd(), 'public', file.path);
    if (existsSync(filepath)) {
      await (await import('fs/promises')).unlink(filepath);
    }

    // Supprimer l'entrée de la base de données
    await db.adminFile.delete({
      where: { type },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}