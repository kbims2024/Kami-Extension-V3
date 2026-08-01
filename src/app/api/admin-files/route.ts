import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Helper: convert a File to a base64 data URI
function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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
    const validMimeTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non supporté (PDF, PNG ou JPEG requis)' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Le fichier ne doit pas dépasser 5 Mo' },
        { status: 400 }
      );
    }

    // Convert file to base64 data URI
    const dataUri = await fileToDataUri(file);

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
        mimeType: file.type,
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
