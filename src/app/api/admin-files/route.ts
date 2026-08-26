import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const MAX_VIDEO_SIZE = 10 * 1024 * 1024;
const VALID_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.ogg', '.avi', '.3gp', '.3gpp', '.m4v'];

// Helper: convert a File to a base64 data URI
async function fileToDataUri(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}

// POST /api/admin-files - Upload a file and store in MongoDB with category = type
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string;

    if (!file || !type) {
      return NextResponse.json(
        { error: 'Fichier ou type manquant' },
        { status: 400 }
      );
    }

    // Validate file type
    const validMimeTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/ogg',
      'video/x-msvideo',
    ];
    const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    const isVideo = file.type.startsWith('video/') || VALID_VIDEO_EXTENSIONS.includes(fileExtension);
    const normalizedMimeType = isVideo && !file.type.startsWith('video/')
      ? fileExtension === '.webm' ? 'video/webm' : fileExtension === '.mov' ? 'video/quicktime' : 'video/mp4'
      : file.type;
    if (!validMimeTypes.includes(file.type) && !isVideo) {
      return NextResponse.json(
        { error: 'Type de fichier non supporté (PDF, image ou vidéo requis)' },
        { status: 400 }
      );
    }

    const maxSize = isVideo ? MAX_VIDEO_SIZE : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `Le fichier ne doit pas dépasser ${isVideo ? '10' : '5'} Mo` },
        { status: 400 }
      );
    }

    // Convert file to base64 data URI
    const uploadFile = normalizedMimeType === file.type
      ? file
      : new File([await file.arrayBuffer()], file.name, { type: normalizedMimeType });
    const dataUri = await fileToDataUri(uploadFile);

    // Delete any existing file with the same category
    try {
      await db.uploadedFile.deleteMany({
        where: { category: type },
      });
    } catch {
      // Ignore if nothing to delete
    }

    // Save new file to MongoDB
    const doc = await db.uploadedFile.create({
      data: {
        filename: file.name,
        mimeType: normalizedMimeType,
        size: file.size,
        data: dataUri,
        category: type,
      },
    });

    return NextResponse.json({
      success: true,
      file: {
        filename: doc.filename,
        mimeType: (doc as any).mimeType,
        size: (doc as any).size,
        url: `/api/files/${doc.id}`,
        category: (doc as any).category,
        updatedAt: (doc as any).updatedAt,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload" },
      { status: 500 }
    );
  }
}

// GET /api/admin-files?type=xxx - Get file info by category
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

    // Return file info without the data field
    const { data, ...fileInfo } = file as any;

    return NextResponse.json({
      file: {
        ...fileInfo,
        url: `/api/files/${file.id}`,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin-files?type=xxx - Delete file by category
export async function DELETE(req: NextRequest) {
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

    const fileId = file.id!;
    await db.uploadedFile.delete({
      where: { id: fileId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}
