import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Online threshold: if lastSeen > 2 minutes ago, consider offline
const ONLINE_THRESHOLD_MS = 2 * 60 * 1000;

export async function GET() {
  try {
    const allUsers = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const now = Date.now();

    // For each user, determine real online status based on lastSeen
    const usersWithStatus = allUsers.map((user: any) => {
      let isOnline = false;
      let lastSeen: Date | null = null;
      let lastSeenRelative = 'Jamais connecté';

        if (user.lastSeen) {
          const lastSeenDate = user.lastSeen instanceof Date ? user.lastSeen : new Date(user.lastSeen);
          lastSeen = lastSeenDate;
          isOnline = (now - lastSeenDate.getTime()) < ONLINE_THRESHOLD_MS;

          // Format relative time in French
          const diffMs = now - lastSeenDate.getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffSecs < 60) {
          lastSeenRelative = "À l'instant";
        } else if (diffMins < 60) {
          lastSeenRelative = `Il y a ${diffMins} min`;
        } else if (diffHours < 24) {
          lastSeenRelative = `Il y a ${diffHours}h`;
        } else if (diffDays === 1) {
          lastSeenRelative = 'Hier';
        } else {
          lastSeenRelative = `Il y a ${diffDays}j`;
        }
      }

      return {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email || null,
        role: user.role,
        status: user.status,
        isOnline,
        lastSeen: lastSeen ? lastSeen.toISOString() : null,
        lastSeenRelative,
        createdAt: user.createdAt.toISOString(),
      };
    });

    // Separate by status
    const onlineUsers = usersWithStatus.filter(u => u.isOnline && u.role === 'USER');
    const offlineUsers = usersWithStatus.filter(u => !u.isOnline && u.role === 'USER');
    const admins = usersWithStatus.filter(u => u.role === 'ADMIN');
    const committeeMembers = usersWithStatus.filter(u => u.role === 'MANAGEMENT_COMMITTEE');

    return NextResponse.json({
      all: usersWithStatus,
      onlineUsers,
      offlineUsers,
      admins,
      committeeMembers,
      summary: {
        total: usersWithStatus.length,
        onlineCount: onlineUsers.length + committeeMembers.filter(u => u.isOnline).length,
        offlineCount: offlineUsers.length,
      },
    });
  } catch (error) {
    console.error('Error fetching users monitor:', error);
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}
