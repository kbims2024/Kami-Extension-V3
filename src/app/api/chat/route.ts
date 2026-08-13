export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Récupérer les messages d'un utilisateur
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 });
    }

    // Pour l'instant, on retourne des messages fictifs
    // Dans un vrai système, on aurait une table Messages dans la base de données
    const mockMessages = [
      {
        id: '1',
        userId,
        sender: 'admin',
        text: 'Bienvenue ! Comment pouvons-nous vous aider ?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
    ];

    return NextResponse.json(mockMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Envoyer un nouveau message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, sender, text } = body;

    if (!userId || !sender || !text) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    // Pour l'instant, on retourne un message fictif
    // Dans un vrai système, on sauvegarderait dans une table Messages
    const message = {
      id: `${Date.now()}`,
      userId,
      sender,
      text,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
