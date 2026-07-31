import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/progress-updates — Public read
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: Record<string, any> = {};
    if (category && category !== 'TOUS') {
      where.category = category;
    }

    const updates = await db.progressUpdate.findMany({
      where,
      orderBy: { isPinned: 'desc' as const },
      take: limit,
    });

    // Sort pinned first, then by date desc
    updates.sort((a: any, b: any) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return NextResponse.json(updates);
  } catch (error) {
    console.error('Error fetching progress updates:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST /api/progress-updates — Admin create
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, images, videos, date, isPinned, authorId } = body;

    if (!title || !description || !category || !date) {
      return NextResponse.json({ error: 'Titre, description, catégorie et date requis' }, { status: 400 });
    }

    const update = await db.progressUpdate.create({
      data: {
        title,
        description,
        category,
        images: Array.isArray(images) ? images : [],
        videos: Array.isArray(videos) ? videos : [],
        date,
        isPinned: Boolean(isPinned),
        authorId: authorId || null,
      },
    });

    return NextResponse.json(update, { status: 201 });
  } catch (error) {
    console.error('Error creating progress update:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
