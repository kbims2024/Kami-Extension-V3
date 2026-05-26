import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/lots - Récupérer tous les lots
export async function GET() {
  try {
    const lots = await db.lot.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(lots);
  } catch (error) {
    console.error('Error fetching lots:', error);
    return NextResponse.json({ error: 'Failed to fetch lots' }, { status: 500 });
  }
}

// POST /api/lots - Créer un nouveau lot
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, surface, priceRes, priceNon } = body;

    if (!name || !surface || !priceRes || !priceNon) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const lot = await db.lot.create({
      data: {
        name,
        surface,
        priceRes,
        priceNon,
        status: 'AVAILABLE',
      },
    });

    return NextResponse.json(lot, { status: 201 });
  } catch (error) {
    console.error('Error creating lot:', error);
    return NextResponse.json({ error: 'Failed to create lot' }, { status: 500 });
  }
}
