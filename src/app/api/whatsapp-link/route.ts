import { NextResponse } from 'next/server';
import { db } from '@/lib/db';


export async function GET() {
  try {
    const settings = await db.settings.findFirst({
      where: { key: 'sav_settings' }
    });

    if (settings && settings.value) {
      const data = JSON.parse(settings.value);
      const whatsapp = data.savWhatsapp || '';

      const isGroupLink = whatsapp.includes('chat.whatsapp.com');
      const whatsappHref = isGroupLink
        ? whatsapp
        : `https://wa.me/${whatsapp.replace(/\s/g, '').replace(/\+/g, '')}`;

      return NextResponse.json({ href: whatsappHref });
    }

    return NextResponse.json({ href: 'https://wa.me/2250758421000' });
  } catch (error) {
    return NextResponse.json({ href: 'https://wa.me/2250758421000' });
  }
}
