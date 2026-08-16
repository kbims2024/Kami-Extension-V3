import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Settings } from '@/lib/models/Settings';

// Endpoint public (lecture seule) utilisé par l'Espace CGL pour connaître les
// fonctionnalités activées par l'administrateur.
export const dynamic = 'force-dynamic';

const SETTINGS_ID = 'settings-default';

function normalizePermissions(input: unknown): Record<string, boolean> {
  const output: Record<string, boolean> = {};
  if (!input || typeof input !== 'object') {
    return output;
  }
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === 'boolean') {
      output[key] = value;
    }
  }
  return output;
}

function parseEnabledFeatures(input: unknown): string[] {
  return Object.entries(normalizePermissions(input))
    .filter(([, enabled]) => enabled === true)
    .map(([key]) => key);
}

async function findOrCreateSettings() {
  await connectDB();
  let doc: any = await Settings.findById(SETTINGS_ID).lean();
  if (!doc) {
    doc = await Settings.findOne().lean();
  }
  if (!doc) {
    doc = await Settings.create({ _id: SETTINGS_ID, cglPermissions: {} }).then((d) => d.toObject());
  }
  return doc;
}

// GET — retourne les fonctionnalités activées pour l'Espace CGL
export async function GET() {
  try {
    const settings = await findOrCreateSettings();
    return NextResponse.json(
      { enabledFeatures: parseEnabledFeatures(settings?.cglPermissions ?? {}) },
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
