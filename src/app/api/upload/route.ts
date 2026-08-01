import { NextRequest, NextResponse } from 'next/server';
import { ObjectId, GridFSBucket } from 'mongodb';
import { connectDB } from '@/lib/mongodb';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'upload';

    if (!file || !file.name) {
      return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 });
    }

    const validMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'application/pdf',
    ];

    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Type de fichier non supporté' }, { status: 400 });
    }

    // Connect to MongoDB and get GridFS bucket
    const mongoose = await connectDB();
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${type}_${timestamp}_${safeName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadStream = bucket.openUploadStream(filename, {
      contentType: file.type,
      metadata: {
        originalName: file.name,
        type,
      },
    });

    // write buffer and wait finish
    await new Promise<void>((resolve, reject) => {
      uploadStream.on('error', (err) => reject(err));
      uploadStream.on('finish', () => resolve());
      uploadStream.end(buffer);
    });

    const fileId = uploadStream.id.toString();

    // store metadata in a collection for quick lookup
    await db.collection('uploadedFiles').insertOne({
      _id: uploadStream.id,
      fileId,
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: buffer.length,
      type,
      uploadedAt: new Date(),
    });

    const url = `/api/serve-file?fileId=${fileId}`;

    return NextResponse.json({ success: true, fileId, url });
  } catch (error) {
    console.error('Upload error (GridFS):', error);
    return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 });
  }
}
