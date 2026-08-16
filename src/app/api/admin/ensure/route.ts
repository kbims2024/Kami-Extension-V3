import { NextResponse } from 'next/server';
import { ensureAdmin } from '@/lib/admin';

export async function GET() {
  try {
    const admin = await ensureAdmin();

    return NextResponse.json({ adminId: admin.id, adminName: admin.name });
  } catch (error) {
    console.error('Error getting admin:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération de l\'admin' }, { status: 500 });
  }
}
