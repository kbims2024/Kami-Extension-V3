import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { readFileSync } from 'fs';

const FLASH_INFO_PRESETS_DB_PATH = join(process.cwd(), 'db', 'flash-info-presets.json');

interface SettingPreset {
  id: string;
  name: string;
  settings: {
    scrollSpeed: number;
    bgColor: string;
    textColor: string;
  };
  createdAt: string;
}

// Helper: Ensure presets DB exists
async function ensurePresetsDb() {
  const dbDir = join(process.cwd(), 'db');
  if (!existsSync(dbDir)) {
    await mkdir(dbDir, { recursive: true });
  }
  if (!existsSync(FLASH_INFO_PRESETS_DB_PATH)) {
    const defaultPresets: { presets: SettingPreset[] } = { presets: [] };
    await writeFile(FLASH_INFO_PRESETS_DB_PATH, JSON.stringify(defaultPresets, null, 2));
  }
}

// Helper: Read presets DB
async function readPresetsDb() {
  await ensurePresetsDb();
  const content = readFileSync(FLASH_INFO_PRESETS_DB_PATH, 'utf-8');
  return JSON.parse(content);
}

// Helper: Write presets DB
async function writePresetsDb(data: any) {
  await ensurePresetsDb();
  await writeFile(FLASH_INFO_PRESETS_DB_PATH, JSON.stringify(data, null, 2));
}

// GET - Récupérer tous les préréglages
export async function GET() {
  try {
    const data = await readPresetsDb();
    return NextResponse.json(data.presets);
  } catch (error) {
    console.error('Erreur lors de la récupération des préréglages:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
  }
}

// POST - Créer un nouveau préréglage
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, settings } = body;

    if (!name || !settings) {
      return NextResponse.json({ error: 'Nom et settings requis' }, { status: 400 });
    }

    const data = await readPresetsDb();
    const newPreset: SettingPreset = {
      id: Date.now().toString(),
      name: name.trim(),
      settings,
      createdAt: new Date().toISOString()
    };

    data.presets.push(newPreset);
    await writePresetsDb(data);

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

    const data = await readPresetsDb();
    data.presets = data.presets.filter((preset: SettingPreset) => preset.id !== id);

    await writePresetsDb(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du préréglage:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}