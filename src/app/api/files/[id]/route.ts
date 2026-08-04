import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/files/[id] - Serve a file stored in MongoDB as base64
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const file = await db.uploadedFile.findUnique({
      where: { id },
    });

    if (!file) {
      return NextResponse.json(
        { error: 'Fichier non trouvé' },
        { status: 404 }
      );
    }

    // file.data is a data URI like "data:image/jpeg;base64,/9j/4AAQ..."
    const dataUri: string = (file as any).data;

    if (!dataUri) {
      return NextResponse.json(
        { error: 'Données du fichier introuvables' },
        { status: 404 }
      );
    }

    // Parse the data URI to extract mimeType and base64 data
    const match = dataUri.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json(
        { error: 'Format de données invalide' },
        { status: 500 }
      );
    }

    const mimeType = match[1];
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': buffer.length.toString(),
        'Content-Disposition': `inline; filename="${(file as any).filename}"`,
        'Cache-Control': 'public, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('[files/[id]/GET] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du fichier' },
      { status: 500 }
    );
  }
}
