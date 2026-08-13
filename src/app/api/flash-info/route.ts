export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { readFileSync } from 'fs';

const FLASH_INFO_DB_PATH = join(process.cwd(), 'db', 'flash-info.json');

// Helper: Ensure flash-info.json exists
async function ensureFlashInfoDb() {
  const dbDir = join(process.cwd(), 'db');
  if (!existsSync(dbDir)) {
    await mkdir(dbDir, { recursive: true });
  }
  if (!existsSync(FLASH_INFO_DB_PATH)) {
    const defaultData = {
      items: [
        {
          id: '1',
          text: '🎉 Promotion spéciale : -10% sur tous les lots de l\'Îlot A jusqu\'au 31 décembre !',
          icon: 'AlertCircle',
          textColor: '#ffffff',
          bgColor: '#1e40af',
          urgent: true,
          position: 0
        },
        {
          id: '2',
          text: '📈 15 lots déjà réservés cette semaine ! Ne manquez pas cette opportunité.',
          icon: 'TrendingUp',
          textColor: '#ffffff',
          bgColor: '#1e40af',
          urgent: false,
          position: 1
        },
        {
          id: '3',
          text: '📅 Journée portes ouvertes : Samedi 15 Décembre de 9h à 17h sur le site.',
          icon: 'Calendar',
          textColor: '#ffffff',
          bgColor: '#1e40af',
          urgent: false,
          position: 2
        }
      ],
      settings: {
        scrollSpeed: 30,
        bgColor: '#1e40af',
        textColor: '#ffffff'
      }
    };
    await writeFile(FLASH_INFO_DB_PATH, JSON.stringify(defaultData, null, 2));
  }
}

// Helper: Read flash-info.json
async function readFlashInfoDb() {
  await ensureFlashInfoDb();
  const content = readFileSync(FLASH_INFO_DB_PATH, 'utf-8');
  return JSON.parse(content);
}

// Helper: Write flash-info.json
async function writeFlashInfoDb(data: any) {
  await ensureFlashInfoDb();
  await writeFile(FLASH_INFO_DB_PATH, JSON.stringify(data, null, 2));
}

// GET - Récupérer tous les flash infos
export async function GET() {
  try {
    const data = await readFlashInfoDb();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des flash infos:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
  }
}

// POST - Créer un nouveau flash info
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, icon, textColor, bgColor, urgent, position } = body;

    if (!text) {
      return NextResponse.json({ error: 'Texte requis' }, { status: 400 });
    }

    const data = await readFlashInfoDb();
    const newItem = {
      id: Date.now().toString(),
      text,
      icon: icon || 'AlertCircle',
      textColor: textColor || '#ffffff',
      bgColor: bgColor || '#1e40af',
      urgent: urgent || false,
      position: position !== undefined ? position : data.items.length
    };

    data.items.push(newItem);
    await writeFlashInfoDb(data);

    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error('Erreur lors de la création du flash info:', error);
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}

// PUT - Mettre à jour un flash info
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, text, icon, textColor, bgColor, urgent, position, settings } = body;

    // If settings provided, update global settings
    if (settings) {
      const data = await readFlashInfoDb();
      data.settings = { ...data.settings, ...settings };
      await writeFlashInfoDb(data);
      return NextResponse.json({ success: true, settings: data.settings });
    }

    // Otherwise, update specific flash info
    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    const data = await readFlashInfoDb();
    const index = data.items.findIndex((item: any) => item.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Flash info non trouvé' }, { status: 404 });
    }

    data.items[index] = {
      ...data.items[index],
      ...(text !== undefined && { text }),
      ...(icon !== undefined && { icon }),
      ...(textColor !== undefined && { textColor }),
      ...(bgColor !== undefined && { bgColor }),
      ...(urgent !== undefined && { urgent }),
      ...(position !== undefined && { position })
    };

    // Reorder items by position
    data.items.sort((a: any, b: any) => a.position - b.position);

    await writeFlashInfoDb(data);

    return NextResponse.json({ success: true, item: data.items[index] });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du flash info:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

// DELETE - Supprimer un flash info
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    const data = await readFlashInfoDb();
    data.items = data.items.filter((item: any) => item.id !== id);

    await writeFlashInfoDb(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du flash info:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
