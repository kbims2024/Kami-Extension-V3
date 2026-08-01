import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/serve-file?type=xxx - Serve a file by category from MongoDB
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    if (!type) {
      return NextResponse.json({ error: 'Type manquant' }, { status: 400 });
    }

    const file = await db.uploadedFile.findFirst({
      where: { category: type },
    });

    if (!file) {
      return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 });
    }

    const dataUri: string = (file as any).data;

    if (!dataUri) {
      return NextResponse.json({ error: 'Données du fichier introuvables' }, { status: 404 });
    }

    // Parse the data URI to extract mimeType and base64 data
    const match = dataUri.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ error: 'Format de données invalide' }, { status: 500 });
    }

    const mimeType = match[1];
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const response = new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': buffer.length.toString(),
        'Content-Disposition': `inline; filename="${(file as any).filename}"`,
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'public, max-age=3600',
      },
    });

    return response;
  } catch (error) {
    console.error('Erreur lors de la récupération du fichier:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du fichier' },
      { status: 500 }
    );
  }
}
