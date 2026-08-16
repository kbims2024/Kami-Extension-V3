import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Settings } from '@/lib/models/Settings';
import {
  normalizeDiscussionConfig,
  toPublicDiscussionConfig,
} from '@/lib/discussion-config';

// Configuration publique des discussions (lecture seule) : utilisée par le
// chat utilisateur pour l'en-tête et par le menu (badge / visibilité).
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

export async function GET() {
  try {
    const settings = await findOrCreateSettings();
    const config = toPublicDiscussionConfig(
      normalizeDiscussionConfig(settings?.discussionConfig)
    );
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
    console.error('Error fetching public discussion config:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
