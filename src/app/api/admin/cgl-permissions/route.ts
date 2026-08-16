import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Settings } from '@/lib/models/Settings';
import { CGL_ADMIN_FEATURES } from '@/lib/cgl-features';

// Endpoint d'administration (lecture + enregistrement) des permissions
// « Espace CGL ». La sauvegarde utilise un upsert direct pour fonctionner
// même si le document de réglages n'existe pas encore ou a un identifiant
// différent.
export const dynamic = 'force-dynamic';

const SETTINGS_ID = 'settings-default';
const AVAILABLE_FEATURES = CGL_ADMIN_FEATURES.map((f) => ({ id: f.id, label: f.label }));
const VALID_FEATURE_IDS = new Set(CGL_ADMIN_FEATURES.map((f) => f.id));

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

// GET — retourne les fonctionnalités disponibles et les permissions actuelles
export async function GET() {
  try {
    const settings = await findOrCreateSettings();
    return NextResponse.json({
      features: AVAILABLE_FEATURES,
      permissions: normalizePermissions(settings?.cglPermissions ?? {}),
    });
  } catch (error) {
    console.error('Error fetching CGL permissions:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT — met à jour les permissions Espace CGL (upsert)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const permissions = body?.permissions;

    if (!permissions || typeof permissions !== 'object' || Array.isArray(permissions)) {
      return NextResponse.json({ error: 'Permissions invalides' }, { status: 400 });
    }

    const cleaned: Record<string, boolean> = {};
    for (const [key, val] of Object.entries(permissions)) {
      if (VALID_FEATURE_IDS.has(key) && typeof val === 'boolean') {
        cleaned[key] = val;
      }
    }

    await connectDB();
    const updated: any = await Settings.findOneAndUpdate(
      { _id: SETTINGS_ID },
      { $set: { cglPermissions: cleaned } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({
      success: true,
      permissions: normalizePermissions(updated?.cglPermissions ?? cleaned),
      settingsId: updated?._id ?? SETTINGS_ID,
    });
  } catch (error) {
    console.error('Error updating CGL permissions:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
