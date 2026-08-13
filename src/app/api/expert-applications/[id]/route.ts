export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PATCH - Approve or reject an expert application (admin/committee)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action, rejectReason } = body;

    const application = await db.expertApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json({ error: 'Candidature introuvable.' }, { status: 404 });
    }

    if (application.status !== 'PENDING') {
      return NextResponse.json({ error: `Cette candidature a déjà été traitée (${application.status}).` }, { status: 400 });
    }

    if (action === 'APPROVE') {
      const updated = await db.expertApplication.update({
        where: { id },
        data: {
          status: 'APPROVED',
          reviewedBy: body.reviewedBy || null,
          reviewedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: `L'expert ${updated.fullName} a été approuvé et ajouté à la liste des partenaires.`,
        application: updated,
      });
    }

    if (action === 'REJECT') {
      if (!rejectReason || rejectReason.trim().length < 5) {
        return NextResponse.json({ error: 'Veuillez fournir une raison de rejet (min. 5 caractères).' }, { status: 400 });
      }

      const updated = await db.expertApplication.update({
        where: { id },
        data: {
          status: 'REJECTED',
          rejectReason: rejectReason.trim(),
          reviewedBy: body.reviewedBy || null,
          reviewedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: `La candidature de ${updated.fullName} a été rejetée.`,
        application: updated,
      });
    }

    return NextResponse.json({ error: 'Action invalide. Utilisez APPROVE ou REJECT.' }, { status: 400 });
  } catch (error) {
    console.error('[expert-applications/[id]/PATCH] Error:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
