import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { readFileSync } from 'fs';

const COLOR_FAVORITES_DB_PATH = join(process.cwd(), 'db', 'color-favorites.json');

interface ColorFavorite {
  id: string;
  name: string;
  value: string;
  type: 'text' | 'background';
  createdAt: string;
}

// Helper: Ensure color-favorites.json exists
async function ensureColorFavoritesDb() {
  const dbDir = join(process.cwd(), 'db');
  if (!existsSync(dbDir)) {
    await mkdir(dbDir, { recursive: true });
  }
  if (!existsSync(COLOR_FAVORITES_DB_PATH)) {
    const defaultData: { favorites: ColorFavorite[] } = { favorites: [] };
    await writeFile(COLOR_FAVORITES_DB_PATH, JSON.stringify(defaultData, null, 2));
  }
}

// Helper: Read color-favorites.json
async function readColorFavoritesDb() {
  await ensureColorFavoritesDb();
  const content = readFileSync(COLOR_FAVORITES_DB_PATH, 'utf-8');
  return JSON.parse(content);
}

// Helper: Write color-favorites.json
async function writeColorFavoritesDb(data: any) {
  await ensureColorFavoritesDb();
  await writeFile(COLOR_FAVORITES_DB_PATH, JSON.stringify(data, null, 2));
}

// GET - Récupérer tous les favoris de couleurs
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'text' ou 'background'

    const data = await readColorFavoritesDb();
    let favorites = data.favorites;

    // Filtrer par type si spécifié
    if (type && (type === 'text' || type === 'background')) {
      favorites = favorites.filter((fav: ColorFavorite) => fav.type === type);
    }

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris de couleurs:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
  }
}

// POST - Ajouter un favori de couleur
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, value, type } = body;

    if (!name || !value || !type) {
      return NextResponse.json({ error: 'Nom, valeur et type requis' }, { status: 400 });
    }

    if (type !== 'text' && type !== 'background') {
      return NextResponse.json({ error: 'Type doit être "text" ou "background"' }, { status: 400 });
    }

    const data = await readColorFavoritesDb();
    const newFavorite: ColorFavorite = {
      id: Date.now().toString(),
      name,
      value,
      type,
      createdAt: new Date().toISOString()
    };

    data.favorites.push(newFavorite);
    await writeColorFavoritesDb(data);

    return NextResponse.json({ success: true, favorite: newFavorite });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du favori de couleur:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'ajout' }, { status: 500 });
  }
}

// DELETE - Supprimer un favori de couleur
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    const data = await readColorFavoritesDb();
    data.favorites = data.favorites.filter((fav: ColorFavorite) => fav.id !== id);

    await writeColorFavoritesDb(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du favori de couleur:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}