import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Log all available models
console.log('[PRISMA] Available models:', Object.keys(db).filter(k => !k.startsWith('_')));
console.log('[PRISMA] adminFile model exists:', typeof db.adminFile);