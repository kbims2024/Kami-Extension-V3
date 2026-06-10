import { NextResponse } from 'next/server';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';
import { readFile } from 'fs/promises';

const FILES_DB_PATH = join(process.cwd(), 'db', 'files.json');

// Helper: Read files.json
async function readFilesDb() {
  try {
    const content = await readFile(FILES_DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return {};
  }
}

export async function GET() {
  try {
    const filesDb = await readFilesDb();

    if (!filesDb['PLAN']) {
      return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 });
    }

    const fileInfo = filesDb['PLAN'];
    const filePath = join(process.cwd(), 'public', fileInfo.path);

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'Fichier physique non trouvé' }, { status: 404 });
    }

    // Lire le fichier
    const fileBuffer = readFileSync(filePath);

    // Créer la réponse avec les headers appropriés pour affichage direct dans le navigateur
    const response = new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': fileInfo.mimeType,
        'Content-Length': fileBuffer.length.toString(),
        'Content-Disposition': `inline; filename="${fileInfo.filename}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });

    return response;
  } catch (error) {
    console.error('Erreur lors de la récupération du fichier:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération du fichier' }, { status: 500 });
  }
}