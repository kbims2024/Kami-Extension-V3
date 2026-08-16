import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10 Mo

const VALID_AUDIO_MIMES = [
  'audio/webm',
  'audio/mp4',
  'audio/ogg',
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/aac',
  'audio/x-m4a',
];

/**
 * POST /api/messages/audio
 * Téléverse un message vocal et le stocke en base.
 * FormData : { file: File, duration?: string }
 * Retourne : { url: "/api/files/:id", mimeType, size, duration }
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const durationRaw = formData.get('duration') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'Fichier audio manquant' }, { status: 400 });
    }

    // Normalise le type MIME (les navigateurs renvoient parfois "audio/webm;codecs=opus").
    const baseMime = (file.type || '').split(';')[0].trim();
    if (!VALID_AUDIO_MIMES.includes(baseMime)) {
      return NextResponse.json(
        { error: 'Type de fichier audio non supporté' },
        { status: 400 }
      );
    }

    if (file.size > MAX_AUDIO_SIZE) {
      return NextResponse.json(
        { error: "Le message vocal ne doit pas dépasser 10 Mo" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const dataUri = `data:${baseMime};base64,${buffer.toString('base64')}`;

    const doc = await db.uploadedFile.create({
      data: {
        filename: file.name || 'message-vocal.webm',
        mimeType: baseMime,
        size: file.size,
        data: dataUri,
        category: 'message-audio',
      },
    });

    const duration = Number(durationRaw);
    return NextResponse.json({
      url: `/api/files/${doc.id}`,
      mimeType: baseMime,
      size: file.size,
      duration: Number.isFinite(duration) && duration > 0 ? Math.round(duration) : null,
    });
  } catch (error) {
    console.error('[POST /api/messages/audio] Erreur:', error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message vocal" },
      { status: 500 }
    );
  }
}
