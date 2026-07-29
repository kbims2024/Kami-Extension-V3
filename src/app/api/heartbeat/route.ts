import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID requis' }, { status: 400 });
    }

    // Mark user as online and update lastSeen
    await db.user.update({
      where: { id: userId },
      data: { isOnline: true, lastSeen: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Heartbeat error:', error);
    return NextResponse.json({ error: 'Erreur heartbeat' }, { status: 500 });
  }
}
