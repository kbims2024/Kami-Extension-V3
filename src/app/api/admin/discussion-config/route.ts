import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Settings } from '@/lib/models/Settings';
import {
  normalizeDiscussionConfig,
  DiscussionConfig,
} from '@/lib/discussion-config';

// Configuration des discussions utilisateur ↔ CGL (lecture + écriture,
// réservée à l'administration).
export const dynamic = 'force-dynamic';

const SETTINGS_ID = 'settings-default';

async function findOrCreateSettings() {
  await connectDB();
  let doc: any = await Settings.findById(SETTINGS_ID).lean();
  if (!doc) {
    doc = await Settings.findOne().lean();
  }
  if (!doc) {
    doc = await Settings.create({ _id: SETTINGS_ID, discussionConfig: {} }).then(
      (d) => d.toObject()
    );
  }
  return doc;
}

// GET — retourne la configuration actuelle des discussions
export async function GET() {
  try {
    const settings = await findOrCreateSettings();
    const config = normalizeDiscussionConfig(settings?.discussionConfig);
    return NextResponse.json(
      { config },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching discussion config:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT — enregistre la configuration des discussions (upsert)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const input = body?.config;

    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      return NextResponse.json({ error: 'Configuration invalide' }, { status: 400 });
    }

    const config: DiscussionConfig = normalizeDiscussionConfig(input);

    await connectDB();
    const updated: any = await Settings.findOneAndUpdate(
      { _id: SETTINGS_ID },
      { $set: { discussionConfig: config } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({
      success: true,
      config: normalizeDiscussionConfig(updated?.discussionConfig ?? config),
      settingsId: updated?._id ?? SETTINGS_ID,
    });
  } catch (error) {
    console.error('Error updating discussion config:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
