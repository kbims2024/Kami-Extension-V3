import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';

export const runtime = 'nodejs';

const FILES_DB_PATH = join(process.cwd(), 'db', 'files.json');

// Helper: Ensure files.json exists
async function ensureFilesDb() {
  const dbDir = join(process.cwd(), 'db');
  if (!existsSync(dbDir)) {
    await mkdir(dbDir, { recursive: true });
  }
  if (!existsSync(FILES_DB_PATH)) {
    await writeFile(FILES_DB_PATH, JSON.stringify({}, null, 2));
  }
}

// Helper: Read files.json
async function readFilesDb() {
  await ensureFilesDb();
  const content = readFileSync(FILES_DB_PATH, 'utf-8');
  return JSON.parse(content);
}

// Helper: Write files.json
async function writeFilesDb(data: any) {
  await ensureFilesDb();
  await writeFile(FILES_DB_PATH, JSON.stringify(data, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // ex: 'PLAN'

    if (!file || !type) {
      return NextResponse.json({ error: 'Fichier ou type manquant' }, { status: 400 });
    }

    // Accepter images, vidéos et pdf
    const validMimeTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Type de fichier non supporté (image/vidéo/pdf requis)' }, { status: 400 });
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

    // Mettre à jour le fichier JSON
    const filesDb = await readFilesDb();

    // Supprimer l'ancien fichier s'il existe
    if (filesDb[type]) {
      try {
        const oldPath = join(process.cwd(), 'public', filesDb[type].path);
        if (existsSync(oldPath)) {
          await (await import('fs/promises')).unlink(oldPath);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'ancien fichier:', error);
      }
    }

    // Mettre à jour l'entrée
    filesDb[type] = {
      filename,
      path: `/uploads/${filename}`,
      mimeType: file.type,
      size: file.size,
      updatedAt: new Date().toISOString(),
    };

    await writeFilesDb(filesDb);

    return NextResponse.json({
      success: true,
      file: filesDb[type],
      path: filesDb[type].path,
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

    const filesDb = await readFilesDb();

    if (!filesDb[type]) {
      return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ file: filesDb[type] });
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

    const filesDb = await readFilesDb();

    if (!filesDb[type]) {
      return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 });
    }

    // Supprimer le fichier physique
    const filepath = join(process.cwd(), 'public', filesDb[type].path);
    if (existsSync(filepath)) {
      await (await import('fs/promises')).unlink(filepath);
    }

    // Supprimer l'entrée du fichier JSON
    delete filesDb[type];
    await writeFilesDb(filesDb);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
