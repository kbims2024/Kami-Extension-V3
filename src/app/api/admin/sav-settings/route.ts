import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

async function getOrCreateSettings() {
  let settings = await db.settings.findFirst();
  if (!settings) {
    settings = await db.settings.create({ data: {} });
  }
  return settings;
}

export async function GET() {
  try {
    const settings = await db.settings.findFirst();
    return NextResponse.json({
      savPhone: settings?.savPhone ?? null,
      savWhatsapp: settings?.savWhatsapp ?? null,
      savEmail: settings?.savEmail ?? null,
      savHoraires: settings?.savHoraires ?? null,
      savFaq: settings?.savFaq ?? null,
      savReglement: settings?.savReglement ?? null,
    });
  } catch (error) {
    console.error('Failed to fetch admin SAV settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { savPhone, savWhatsapp, savEmail, savHoraires, savFaq, savReglement } = body;

    const updateData: Record<string, string> = {};
    if (savPhone !== undefined) updateData.savPhone = savPhone;
    if (savWhatsapp !== undefined) updateData.savWhatsapp = savWhatsapp;
    if (savEmail !== undefined) updateData.savEmail = savEmail;
    if (savHoraires !== undefined) updateData.savHoraires = JSON.stringify(savHoraires);
    if (savFaq !== undefined) updateData.savFaq = JSON.stringify(savFaq);
    if (savReglement !== undefined) updateData.savReglement = savReglement.trim();

    const settings = await getOrCreateSettings();
    const updated = await db.settings.update({ where: { id: settings.id }, data: updateData });

    return NextResponse.json({
      savPhone: updated.savPhone ?? null,
      savWhatsapp: updated.savWhatsapp ?? null,
      savEmail: updated.savEmail ?? null,
      savHoraires: updated.savHoraires ?? null,
      savFaq: updated.savFaq ?? null,
      savReglement: updated.savReglement ?? null,
    });
  } catch (error) {
    console.error('Failed to update admin SAV settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
