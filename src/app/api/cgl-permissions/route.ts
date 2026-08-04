import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET — public endpoint for CGL members to fetch their enabled features
export async function GET() {
  try {
    const settings = await db.settings.findFirst({
      where: { id: 'settings-default' },
    });

    const enabled: string[] = [];
    if (settings?.cglPermissions) {
      try {
        const parsed =
          typeof settings.cglPermissions === 'string'
            ? JSON.parse(settings.cglPermissions)
            : settings.cglPermissions;
        for (const [key, val] of Object.entries(parsed)) {
          if (val === true) enabled.push(key);
        }
      } catch {
        // ignore
      }
    }

    return NextResponse.json({ enabledFeatures: enabled });
  } catch (error) {
    console.error('Error fetching CGL permissions:', error);
    return NextResponse.json({ enabledFeatures: [] });
  }
}
