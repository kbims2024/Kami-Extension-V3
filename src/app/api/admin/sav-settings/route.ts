export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';


export async function GET() {
  try {
    const settings = await db.settings.findFirst({
      where: { key: 'sav_settings' }
    });
    return NextResponse.json(settings ? JSON.parse(settings.value) : {});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const settings = await db.settings.update({
      where: { key: 'sav_settings' },
      data: { value: JSON.stringify(body) }
    });
    return NextResponse.json(JSON.parse(settings.value));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
