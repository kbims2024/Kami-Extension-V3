import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { readFileSync } from 'fs';

const COLOR_FAVORITES_DB_PATH = join(process.cwd(), 'db', 'color-favorites.json');

// Helper: Ensure color-favorites.json exists
async function ensureColorFavoritesDb() {
  const dbDir = join(process.cwd(), 'db');
  if (!existsSync(dbDir)) {
    await mkdir(dbDir, { recursive: true });
  }
  if (!existsSync(COLOR_FAVORITES_DB_PATH)) {
    await writeFile(COLOR_FAVORITES_DB_PATH, JSON.stringify([], null, 2));
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
export async function GET() {
  try {
    const favorites = await readColorFavoritesDb();
    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris de couleurs:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Créer un nouveau favori de couleur
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, value, type } = body;

    if (!name || !value || !type) {
      return NextResponse.json({ error: 'Nom, valeur et type requis' }, { status: 400 });
    }

    const favorites = await readColorFavoritesDb();
    const newFavorite = {
      id: Date.now().toString(),
      name,
      value,
      type, // 'text' or 'background'
      createdAt: new Date().toISOString()
    };

    favorites.push(newFavorite);
    await writeColorFavoritesDb(favorites);

    return NextResponse.json({ success: true, favorite: newFavorite });
  } catch (error) {
    console.error('Erreur lors de la création du favori de couleur:', error);
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
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

    const favorites = await readColorFavoritesDb();
    const filteredFavorites = favorites.filter((fav: any) => fav.id !== id);

    await writeColorFavoritesDb(filteredFavorites);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du favori de couleur:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}