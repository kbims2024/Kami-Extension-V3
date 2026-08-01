import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Helper: convert a File to a base64 data URI
function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // reader.result is already a data URI like "data:image/jpeg;base64,..."
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
];

// POST /api/upload - Upload a file and store as base64 in MongoDB
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || null;

    if (!file) {
      return NextResponse.json(
        { error: 'Fichier manquant' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non supporté (JPEG, PNG, WebP, GIF ou PDF requis)' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Le fichier ne doit pas dépasser 5 Mo' },
        { status: 400 }
      );
    }

    // Convert file to base64 data URI
    const dataUri = await fileToDataUri(file);

    // Save to MongoDB
    const doc = await db.uploadedFile.create({
      data: {
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        data: dataUri,
        category,
      },
    });

    return NextResponse.json({
      success: true,
      fileId: doc.id,
      url: `/api/files/${doc.id}`,
    });
  } catch (error) {
    console.error('[upload/POST] Error:', error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload" },
      { status: 500 }
    );
  }
}

// GET /api/upload?category=xxx - List files by category
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const where: Record<string, any> = {};
    if (category) {
      where.category = category;
    }

    // Return files without the data field (too large for listing)
    const files = await db.uploadedFile.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Strip data from response to keep it lightweight
    const result = files.map((f: any) => {
      const { data, ...rest } = f;
      return { ...rest, url: `/api/files/${f.id}` };
    });

    return NextResponse.json({ files: result });
  } catch (error) {
    console.error('[upload/GET] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des fichiers' },
      { status: 500 }
    );
  }
}
