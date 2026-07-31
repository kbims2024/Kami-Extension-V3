import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';

// GET - Récupérer le logo
export async function GET() {
  try {
    let logo = await db.logo.findFirst();

    if (!logo) {
      // Créer un logo par défaut
      logo = await db.logo.create({
        data: {
          text: 'KAMI-EXTENSION',
          textColor: '#8B5E3C',
          backgroundColor: '#ffffff',
        },
      });
    }

    return NextResponse.json(logo);
  } catch (error) {
    console.error('Error fetching logo:', error);
    return NextResponse.json({ error: 'Error fetching logo' }, { status: 500 });
  }
}

// POST - Créer un logo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, imageUrl, textColor, backgroundColor } = body;

    // Check if logo already exists
    const existingLogo = await db.logo.findFirst();
    if (existingLogo) {
      return NextResponse.json({ error: 'Logo already exists' }, { status: 400 });
    }

    const logo = await db.logo.create({
      data: {
        text,
        imageUrl,
        textColor,
        backgroundColor,
      },
    });

    return NextResponse.json(logo);
  } catch (error) {
    console.error('Error creating logo:', error);
    return NextResponse.json({ error: 'Error creating logo' }, { status: 500 });
  }
}

// PUT - Mettre à jour le logo
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, text, imageUrl, textColor, backgroundColor } = body;

    // Get existing logo to check for old image
    const existingLogo = await db.logo.findFirst();

    // If imageUrl changed and there's an old image, delete it
    if (existingLogo?.imageUrl && imageUrl !== existingLogo.imageUrl && existingLogo.imageUrl.startsWith('/uploads/')) {
      const oldImagePath = path.join(process.cwd(), 'public', existingLogo.imageUrl);
      try {
        await fs.unlink(oldImagePath);
      } catch (error) {
        console.error('Error deleting old image:', error);
      }
    }

    const logo = await db.logo.update({
      where: { id: existingLogo?.id || id },
      data: {
        text,
        imageUrl,
        textColor,
        backgroundColor,
      },
    });

    return NextResponse.json(logo);
  } catch (error) {
    console.error('Error updating logo:', error);
    return NextResponse.json({ error: 'Error updating logo' }, { status: 500 });
  }
}

// DELETE - Supprimer le logo
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Logo ID is required' }, { status: 400 });
    }

    // Get logo before deleting
    const logo = await db.logo.findUnique({
      where: { id },
    });

    // Delete image if exists
    if (logo?.imageUrl && logo.imageUrl.startsWith('/uploads/')) {
      const imagePath = path.join(process.cwd(), 'public', logo.imageUrl);
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    await db.logo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting logo:', error);
    return NextResponse.json({ error: 'Error deleting logo' }, { status: 500 });
  }
}