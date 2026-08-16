import { db } from '@/lib/db';

/**
 * Retrouve (ou crée) le compte administrateur/CGL central de la messagerie.
 *
 * Tous les messages des utilisateurs arrivent sur ce compte (phone « ADMIN »).
 * Chaque route doit passer par cet unique helper afin de garantir que le même
 * `admin.id` est utilisé côté émetteur (ChatPage) et côté récepteur
 * (committee-chat, unread, auto-réponse).
 *
 * Important : la création inclut un `pseudo`, sinon Mongoose lève une
 * ValidationError (« pseudo is required ») et aucun message ne peut partir.
 */
export async function ensureAdmin() {
  const admin = await db.user.findFirst({
    where: { phone: 'ADMIN' },
    orderBy: { createdAt: 'asc' },
  });

  if (admin) {
    return admin;
  }

  return db.user.create({
    data: {
      name: 'Administrateur',
      pseudo: 'ADMIN',
      phone: 'ADMIN',
      isResident: true,
    },
  });
}
