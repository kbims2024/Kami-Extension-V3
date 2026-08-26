import { db } from '@/lib/db';

export interface ManagementNotificationInput {
  title: string;
  message: string;
  type: string;
  data?: Record<string, unknown>;
}

/** Notify every active admin/CGL account, including the central admin account. */
export async function notifyManagement(input: ManagementNotificationInput) {
  const [committeeMembers, admins, centralAdmin] = await Promise.all([
    db.user.findMany({ where: { role: 'MANAGEMENT_COMMITTEE', status: 'ACTIVE' } }),
    db.user.findMany({ where: { role: 'ADMIN', status: 'ACTIVE' } }),
    db.user.findFirst({ where: { phone: 'ADMIN' } }),
  ]);

  const recipients = new Map<string, (typeof committeeMembers)[number]>();
  [...committeeMembers, ...admins, ...(centralAdmin ? [centralAdmin] : [])].forEach((user) => {
    recipients.set(user.id, user);
  });

  await Promise.all(
    Array.from(recipients.values()).map((user) =>
      db.notification.create({
        data: {
          userId: user.id,
          title: input.title,
          message: input.message,
          type: input.type,
          read: false,
          data: input.data ? JSON.stringify(input.data) : null,
        },
      })
    )
  );
}