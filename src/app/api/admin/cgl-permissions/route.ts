import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CGL_PERMISSIONS_ID = 'cgl-permissions-default';

const AVAILABLE_FEATURES = [
  { id: 'dashboard', label: 'Tableau de Bord', icon: 'chart' },
  { id: 'payments', label: 'Valider Paiements', icon: 'payment' },
  { id: 'add-lots', label: 'Ajouter Lots', icon: 'plus' },
  { id: 'logo', label: 'Éditer le Logo', icon: 'logo' },
  { id: 'hero-image', label: 'Image de Fond', icon: 'image' },
  { id: 'committee', label: 'Gestion du Comité', icon: 'shield' },
  { id: 'flash-infos', label: 'Flash Infos', icon: 'flash' },
  { id: 'expert-applications', label: 'Candidatures Experts', icon: 'expert' },
  { id: 'users-monitor', label: 'Surveillance Connexions', icon: 'activity' },
  { id: 'files', label: 'Gérer Fichiers', icon: 'files' },
  { id: 'progress-updates', label: 'Avancement Travaux', icon: 'construction' },
  { id: 'subscriber-tracking', label: 'Suivi Souscripteurs', icon: 'trending' },
  { id: 'sav-settings', label: 'Paramètres SAV', icon: 'headset' },
];

// GET — return current CGL permissions
export async function GET() {
  try {
    const settings = await db.settings.findFirst({
      where: { id: 'settings-default' },
    });

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

    return NextResponse.json({
      features: AVAILABLE_FEATURES,
      permissions: currentPermissions,
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

    if (!permissions || typeof permissions !== 'object') {
      return NextResponse.json({ error: 'Permissions invalides' }, { status: 400 });
    }

    // Only allow known feature IDs
    const validIds = AVAILABLE_FEATURES.map((f) => f.id);
    const cleaned: Record<string, boolean> = {};
    for (const [key, val] of Object.entries(permissions)) {
      if (validIds.includes(key)) {
        cleaned[key] = Boolean(val);
      }
    }

    await db.settings.update({
      where: { id: 'settings-default' },
      data: { cglPermissions: JSON.stringify(cleaned) },
    });

    return NextResponse.json({ success: true, permissions: cleaned });
  } catch (error) {
    console.error('Error updating CGL permissions:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
