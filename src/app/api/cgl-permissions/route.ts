import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const SETTINGS_ID = 'settings-default';

async function findSettings() {
  let settings = await db.settings.findFirst({ where: { id: SETTINGS_ID } });
  if (!settings) {
    settings = await db.settings.findFirst({ where: { _id: SETTINGS_ID } });
  }
  if (!settings) {
    settings = await db.settings.create({
      data: {
        _id: SETTINGS_ID,
        cglPermissions: {},
      },
    });
  }
  return settings;
}

function parseEnabledFeatures(settings: any): string[] {
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
  return enabled;
}

// GET — public endpoint for CGL members to fetch their enabled features
export async function GET() {
  try {
    const settings = await findSettings();
    return NextResponse.json(
      { enabledFeatures: parseEnabledFeatures(settings) },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching CGL permissions:', error);
    return NextResponse.json({ enabledFeatures: [] });
  }
}
