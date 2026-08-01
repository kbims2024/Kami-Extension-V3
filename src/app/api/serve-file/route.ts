import { NextRequest, NextResponse } from 'next/server';
import { GridFSBucket, ObjectId } from 'mongodb';
import { connectDB } from '@/lib/mongodb';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json({ error: 'fileId manquant' }, { status: 400 });
    }

    if (!ObjectId.isValid(fileId)) {
      return NextResponse.json({ error: 'fileId invalide' }, { status: 400 });
    }

    const mongoose = await connectDB();
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

    // Lookup metadata stored in uploadedFiles
    const meta = await db.collection('uploadedFiles').findOne({ _id: new ObjectId(fileId) });
    if (!meta) {
      return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 });
    }

    // Stream file from GridFS
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
    const chunks: Buffer[] = [];

    await new Promise<void>((resolve, reject) => {
      downloadStream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      downloadStream.on('error', (err) => reject(err));
      downloadStream.on('end', () => resolve());
    });

    const buffer = Buffer.concat(chunks);

    const headers = {
      'Content-Type': meta.mimeType || 'application/octet-stream',
      'Content-Length': buffer.length.toString(),
      'Content-Disposition': `inline; filename="${meta.originalName || meta.filename || 'file'}"`,
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, max-age=3600',
    } as Record<string, string>;

    return new NextResponse(buffer, { headers });
  } catch (error) {
    console.error('Erreur lors de la récupération du fichier (GridFS):', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération du fichier' }, { status: 500 });
  }
}
