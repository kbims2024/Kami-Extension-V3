import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CGL_ADMIN_FEATURES } from '@/lib/cgl-features';


const CGL_PERMISSIONS_ID = 'settings-default';
const AVAILABLE_FEATURES = CGL_ADMIN_FEATURES.map((f) => ({ id: f.id, label: f.label }));

async function findSettings() {
  let settings = await db.settings.findFirst({ where: { id: CGL_PERMISSIONS_ID } });
  if (!settings) {
    settings = await db.settings.findFirst({ where: { _id: CGL_PERMISSIONS_ID } });
  }
  return settings;
}

function parsePermissions(settings: any): Record<string, boolean> {
  const currentPermissions: Record<string, boolean> = {};
  if (settings?.cglPermissions) {
    try {
      const parsed = typeof settings.cglPermissions === 'string'
        ? JSON.parse(settings.cglPermissions)
        : settings.cglPermissions;
      Object.assign(currentPermissions, parsed);
    } catch {
      // ignore corrupt data
    }
  }
  return currentPermissions;
}

// GET — return current CGL permissions
export async function GET() {
  try {
    const settings = await findSettings();
    return NextResponse.json({
      features: AVAILABLE_FEATURES,
      permissions: parsePermissions(settings),
    });
  } catch (error) {
    console.error('Error fetching CGL permissions:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT — update CGL permissions
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { permissions } = body;

    if (!permissions || typeof permissions !== 'object' || Array.isArray(permissions)) {
      return NextResponse.json({ error: 'Permissions invalides' }, { status: 400 });
    }

    const validIds = AVAILABLE_FEATURES.map((f) => f.id);
    const cleaned: Record<string, boolean> = {};
    for (const [key, val] of Object.entries(permissions)) {
      if (validIds.includes(key)) {
        cleaned[key] = Boolean(val);
      }
    }

    const existing = await findSettings();
    if (existing) {
      // Update existing settings - handle both id and _id patterns
      await db.settings.update({
        where: { id: existing.id || existing._id },
        data: { cglPermissions: JSON.stringify(cleaned) },
      });
    } else {
      // Create new settings if doesn't exist
      await db.settings.create({
        data: { 
          id: CGL_PERMISSIONS_ID,
          _id: CGL_PERMISSIONS_ID, 
          cglPermissions: JSON.stringify(cleaned) 
        },
      });
    }

    return NextResponse.json({ success: true, permissions: cleaned });
  } catch (error) {
    console.error('Error updating CGL permissions:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
