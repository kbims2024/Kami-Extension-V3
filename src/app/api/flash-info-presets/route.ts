export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { readFileSync } from 'fs';

const PRESETS_DB_PATH = join(process.cwd(), 'db', 'flash-info-presets.json');

// Helper: Ensure flash-info-presets.json exists
async function ensurePresetsDb() {
  const dbDir = join(process.cwd(), 'db');
  if (!existsSync(dbDir)) {
    await mkdir(dbDir, { recursive: true });
  }
  if (!existsSync(PRESETS_DB_PATH)) {
    await writeFile(PRESETS_DB_PATH, JSON.stringify([], null, 2));
  }
}

// Helper: Read flash-info-presets.json
async function readPresetsDb() {
  await ensurePresetsDb();
  const content = readFileSync(PRESETS_DB_PATH, 'utf-8');
  return JSON.parse(content);
}

// Helper: Write flash-info-presets.json
async function writePresetsDb(data: any) {
  await ensurePresetsDb();
  await writeFile(PRESETS_DB_PATH, JSON.stringify(data, null, 2));
}

// GET - Récupérer tous les préréglages
export async function GET() {
  try {
    const presets = await readPresetsDb();
    return NextResponse.json(presets);
  } catch (error) {
    console.error('Erreur lors de la récupération des préréglages:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Créer un nouveau préréglage
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, settings } = body;

    if (!name || !settings) {
      return NextResponse.json({ error: 'Nom et paramètres requis' }, { status: 400 });
    }

    const presets = await readPresetsDb();
    const newPreset = {
      id: Date.now().toString(),
      name,
      settings: {
        scrollSpeed: settings.scrollSpeed || 30,
        bgColor: settings.bgColor || '#1e40af',
        textColor: settings.textColor || '#ffffff'
      },
      createdAt: new Date().toISOString()
    };

    presets.push(newPreset);
    await writePresetsDb(presets);

    return NextResponse.json({ success: true, preset: newPreset });
  } catch (error) {
    console.error('Erreur lors de la création du préréglage:', error);
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}

// DELETE - Supprimer un préréglage
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    const presets = await readPresetsDb();
    const filteredPresets = presets.filter((preset: any) => preset.id !== id);

    await writePresetsDb(filteredPresets);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du préréglage:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
