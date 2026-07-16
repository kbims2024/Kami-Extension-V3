import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Le fichier doit être une image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'L\'image ne doit pas dépasser 5MB' }, { status: 400 });
    }

    // Ensure uploads/logo directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'logo');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 10);
    const ext = file.name.split('.').pop() || 'png';
    const filename = `logo_${timestamp}_${randomSuffix}.${ext}`;
    const filepath = join(uploadsDir, filename);

    // Write file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return the public URL
    const url = `/uploads/logo/${filename}`;

    return NextResponse.json({ url, filename });
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    return NextResponse.json({ error: 'Erreur lors du téléchargement' }, { status: 500 });
  }
}