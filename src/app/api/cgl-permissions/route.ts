import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const SETTINGS_ID = 'settings-default';

function normalizePermissions(input: unknown): Record<string, boolean> {
  const output: Record<string, boolean> = {};
  if (!input || typeof input !== 'object') {
    return output;
  }

  if (typeof input === 'string') {
    try {
      return normalizePermissions(JSON.parse(input));
    } catch {
      return output;
    }
  }

  for (const [key, value] of Object.entries(input)) {
    if (typeof value === 'boolean') {
      output[key] = value;
    }
  }

  return output;
}

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
  const perms = normalizePermissions(settings?.cglPermissions ?? {});
  return Object.entries(perms)
    .filter(([, enabled]) => enabled === true)
    .map(([key]) => key);
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
