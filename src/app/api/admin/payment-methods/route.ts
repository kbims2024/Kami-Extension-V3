import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const PAYMENT_METHOD_IDS = ['wave', 'orange_money', 'moov_money', 'mtn_money'];

async function getPaymentLogo(methodId: string): Promise<string | null> {
  try {
    const file = await db.uploadedFile.findFirst({
      where: { category: `PAYMENT_${methodId}` },
    });

    if (!file?.id) return null;
    return `/api/files/${file.id}`;
  } catch (error) {
    console.error(`Error loading payment logo ${methodId}:`, error);
    return null;
  }
}

export async function GET() {
  try {
    const logos: Record<string, string | null> = {};

    for (const methodId of PAYMENT_METHOD_IDS) {
      logos[methodId] = await getPaymentLogo(methodId);
    }

    const settings = await db.settings.findFirst();
    return NextResponse.json({
      success: true,
      logos,
      numbers: {
        moov_money: settings?.paymentMoovNumber || '0140916502',
        orange_money: settings?.paymentOrangeNumber || '0749615456',
        mtn_money: settings?.paymentMtnNumber || '0505623221',
        wave: settings?.paymentWaveNumber || '0140252521',
      },
    });
  } catch (error) {
    console.error('Error fetching payment method logos:', error);
    return NextResponse.json(
      { success: false, error: 'Impossible de charger les logos de paiement' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const fieldMap: Record<string, string> = {
      moov_money: 'paymentMoovNumber',
      orange_money: 'paymentOrangeNumber',
      mtn_money: 'paymentMtnNumber',
      wave: 'paymentWaveNumber',
    };
    const updateData: Record<string, string> = {};
    for (const [methodId, field] of Object.entries(fieldMap)) {
      if (body.numbers?.[methodId] !== undefined) {
        const value = String(body.numbers[methodId]).replace(/\s+/g, '');
        if (!/^\d{8,15}$/.test(value)) {
          return NextResponse.json({ error: `Numéro invalide pour ${methodId}` }, { status: 400 });
        }
        updateData[field] = value;
      }
    }
    let settings = await db.settings.findFirst();
    if (!settings) settings = await db.settings.create({ data: {} });
    const updated = await db.settings.update({ where: { id: settings.id }, data: updateData });
    return NextResponse.json({
      success: true,
      numbers: {
        moov_money: updated.paymentMoovNumber || '0140916502',
        orange_money: updated.paymentOrangeNumber || '0749615456',
        mtn_money: updated.paymentMtnNumber || '0505623221',
        wave: updated.paymentWaveNumber || '0140252521',
      },
    });
  } catch (error) {
    console.error('Error updating payment method numbers:', error);
    return NextResponse.json({ error: 'Impossible d’enregistrer les numéros marchands' }, { status: 500 });
  }
}
