import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, extname } from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'UPLOAD';

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

    const uploadsDir = join(process.cwd(), 'public', 'uploads', type.toLowerCase());
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const ext = extname(file.name) || '';
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${type}_${timestamp}_${safeName}`;
    const filepath = join(uploadsDir, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    const filePath = `/uploads/${type.toLowerCase()}/${filename}`;

    return NextResponse.json({ success: true, path: filePath, url: filePath });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Erreur lors de l upload' }, { status: 500 });
  }
}
