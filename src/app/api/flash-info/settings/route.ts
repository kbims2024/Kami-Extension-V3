import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { readFileSync } from 'fs';

const FLASH_INFO_DB_PATH = join(process.cwd(), 'db', 'flash-info.json');

// Helper: Read flash-info.json
async function readFlashInfoDb() {
  const dbDir = join(process.cwd(), 'db');
  if (!existsSync(dbDir)) {
    await mkdir(dbDir, { recursive: true });
  }
  if (!existsSync(FLASH_INFO_DB_PATH)) {
    const defaultData = {
      items: [],
      settings: {
        scrollSpeed: 30,
        bgColor: '#1e40af',
        textColor: '#ffffff'
      }
    };
    await writeFile(FLASH_INFO_DB_PATH, JSON.stringify(defaultData, null, 2));
  }
  const content = readFileSync(FLASH_INFO_DB_PATH, 'utf-8');
  return JSON.parse(content);
}

// Helper: Write flash-info.json
async function writeFlashInfoDb(data: any) {
  await writeFile(FLASH_INFO_DB_PATH, JSON.stringify(data, null, 2));
}

// PUT - Mettre à jour les paramètres globaux de la barre flash info
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { scrollSpeed, bgColor, textColor } = body;

    const data = await readFlashInfoDb();
    data.settings = {
      scrollSpeed: 30,
      bgColor: '#1e40af',
      textColor: '#ffffff',
      ...data.settings,
    };

    // Update settings
    if (scrollSpeed !== undefined) {
      const parsedScrollSpeed = Number(scrollSpeed);
      if (!Number.isFinite(parsedScrollSpeed) || parsedScrollSpeed < 10 || parsedScrollSpeed > 120) {
        return NextResponse.json({ error: 'La vitesse doit être comprise entre 10 et 120 secondes' }, { status: 400 });
      }
      data.settings.scrollSpeed = parsedScrollSpeed;
    }
    if (bgColor !== undefined) {
      data.settings.bgColor = bgColor;
    }
    if (textColor !== undefined) {
      data.settings.textColor = textColor;
    }

    await writeFlashInfoDb(data);

    return NextResponse.json({ success: true, settings: data.settings });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}
