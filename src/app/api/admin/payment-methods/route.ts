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

    return NextResponse.json({
      success: true,
      logos,
    });
  } catch (error) {
    console.error('Error fetching payment method logos:', error);
    return NextResponse.json(
      { success: false, error: 'Impossible de charger les logos de paiement' },
      { status: 500 }
    );
  }
}
