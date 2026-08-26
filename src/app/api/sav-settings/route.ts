import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const DEFAULT_PHONE = '+225 27 22 49 00 00';
const DEFAULT_WHATSAPP = '+225 07 58 42 10 00';
const DEFAULT_EMAIL = 'sav@kami-extension.com';
const DEFAULT_HORAIRES = [
  { day: 'Lundi - Vendredi', hours: '08h00 - 18h00' },
  { day: 'Samedi', hours: '09h00 - 13h00' },
  { day: 'Dimanche & jours fériés', hours: 'Fermé' },
];
const DEFAULT_FAQ = [
  {
    question: "Comment suivre l'avancée de mon paiement ?",
    answer: "Connectez-vous à votre espace client pour voir l'historique complet de vos versements et le solde restant. Vous pouvez aussi contacter notre SAV par téléphone ou WhatsApp.",
  },
  {
    question: 'Comment obtenir mon reçu de paiement ?',
    answer: 'Les reçus sont disponibles dans la section « Documents & attestations » de votre espace client. Vous pouvez les télécharger en PDF ou demander une copie physique au bureau.',
  },
  {
    question: 'Quand recevrai-je mes documents de propriété ?',
    answer: "Après le paiement intégral du lot, les documents sont préparés sous 15 à 30 jours. Vous serez notifié par message dès qu'ils seront disponibles au retrait.",
  },
  {
    question: "Que faire si j'ai un litige ou une réclamation ?",
    answer: "Adressez votre réclamation par email au service après-vente ou via WhatsApp. Un conseiller vous recontactera sous 48h ouvrées avec un accusé de réception et un numéro de ticket.",
  },
];

export async function GET() {
  try {
    const settings = await db.settings.findFirst();
    if (!settings) {
      return NextResponse.json({
        savPhone: DEFAULT_PHONE,
        savWhatsapp: DEFAULT_WHATSAPP,
        savEmail: DEFAULT_EMAIL,
        savHoraires: DEFAULT_HORAIRES,
        savFaq: DEFAULT_FAQ,
        savReglement: null,
      });
    }

    let savHoraires = DEFAULT_HORAIRES;
    let savFaq = DEFAULT_FAQ;

    try {
      if (settings.savHoraires) savHoraires = JSON.parse(settings.savHoraires as string);
    } catch { /* keep default */ }

    try {
      if (settings.savFaq) savFaq = JSON.parse(settings.savFaq as string);
    } catch { /* keep default */ }

    return NextResponse.json({
      savPhone: (settings.savPhone as string) || DEFAULT_PHONE,
      savWhatsapp: (settings.savWhatsapp as string) || DEFAULT_WHATSAPP,
      savEmail: (settings.savEmail as string) || DEFAULT_EMAIL,
      savHoraires,
      savFaq,
      savReglement: settings.savReglement || null,
    });
  } catch (error) {
    console.error('Error fetching SAV settings:', error);
    return NextResponse.json({
      savPhone: DEFAULT_PHONE,
      savWhatsapp: DEFAULT_WHATSAPP,
      savEmail: DEFAULT_EMAIL,
      savHoraires: DEFAULT_HORAIRES,
      savFaq: DEFAULT_FAQ,
      savReglement: null,
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Admin-only check
    const adminRole = request.headers.get('x-admin-role');
    if (adminRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const body = await request.json();
    const { savPhone, savWhatsapp, savEmail, savHoraires, savFaq, savReglement } = body;

    const updateData: Record<string, string> = {};
    if (savPhone !== undefined) updateData.savPhone = savPhone;
    if (savWhatsapp !== undefined) updateData.savWhatsapp = savWhatsapp;
    if (savEmail !== undefined) updateData.savEmail = savEmail;
    if (savHoraires !== undefined) updateData.savHoraires = JSON.stringify(savHoraires);
    if (savFaq !== undefined) updateData.savFaq = JSON.stringify(savFaq);
    if (savReglement !== undefined) updateData.savReglement = savReglement.trim();

    const existing = await db.settings.findFirst();
    let settings: any;
    if (existing && existing.id) {
      settings = await db.settings.update({ where: { id: existing.id as string }, data: updateData });
    } else {
      settings = await db.settings.create({ data: updateData });
    }

    let parsedHoraires = DEFAULT_HORAIRES;
    let parsedFaq = DEFAULT_FAQ;
    try {
      if (settings.savHoraires) parsedHoraires = JSON.parse(settings.savHoraires as string);
    } catch { /* keep default */ }
    try {
      if (settings.savFaq) parsedFaq = JSON.parse(settings.savFaq as string);
    } catch { /* keep default */ }

    return NextResponse.json({
      savPhone: (settings.savPhone as string) || DEFAULT_PHONE,
      savWhatsapp: (settings.savWhatsapp as string) || DEFAULT_WHATSAPP,
      savEmail: (settings.savEmail as string) || DEFAULT_EMAIL,
      savHoraires: parsedHoraires,
      savFaq: parsedFaq,
      savReglement: settings.savReglement || null,
    });
  } catch (error) {
    console.error('Error updating SAV settings:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}
