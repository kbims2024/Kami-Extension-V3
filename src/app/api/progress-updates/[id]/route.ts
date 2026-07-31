import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// DELETE /api/progress-updates/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.progressUpdate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting progress update:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PATCH /api/progress-updates/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data: Record<string, any> = { ...body };
    if (data.images !== undefined) {
      data.images = Array.isArray(data.images) ? data.images : [];
    }
    if (data.videos !== undefined) {
      data.videos = Array.isArray(data.videos) ? data.videos : [];
    }
    const updated = await db.progressUpdate.update({
      where: { id },
      data,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating progress update:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
