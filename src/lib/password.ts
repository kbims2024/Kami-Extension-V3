import { createHash, randomBytes, scrypt, timingSafeEqual } from 'crypto'

// KDF robuste (scrypt) au lieu du SHA-256 simple.
// Format stocké : scrypt$N$r$p$salt$hash
const SCRYPT_KEYLEN = 64
const SCRYPT_DEFAULT: { N: number; r: number; p: number } = { N: 16384, r: 8, p: 1 }

function scryptAsync(password: string, salt: string, params: { N: number; r: number; p: number }): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, SCRYPT_KEYLEN, params, (err, derivedKey) => {
      if (err) reject(err)
      else resolve(derivedKey)
    })
  })
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const { N, r, p } = SCRYPT_DEFAULT
  const derivedKey = await scryptAsync(password, salt, { N, r, p })
  return `scrypt$${N}$${r}$${p}$${salt}$${derivedKey.toString('hex')}`
}

// Ancien format utilisé avant la migration : `<salt>:<sha256(password + salt)>`
export function isLegacyPasswordHash(hashedPassword: string): boolean {
  return !!hashedPassword && !hashedPassword.startsWith('scrypt$')
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  if (!hashedPassword) return false

  if (isLegacyPasswordHash(hashedPassword)) {
    const [salt, hash] = hashedPassword.split(':')
    if (!salt || !hash) return false
    const computedHash = createHash('sha256').update(password + salt).digest('hex')
    return hash === computedHash
  }

  const parts = hashedPassword.split('$')
  if (parts.length !== 6) return false

  const [, N, r, p, salt, storedHashHex] = parts
  const NNum = Number(N)
  const rNum = Number(r)
  const pNum = Number(p)
  if (!NNum || !rNum || !pNum || !salt || !storedHashHex) return false

  const storedHash = Buffer.from(storedHashHex, 'hex')
  if (storedHash.length !== SCRYPT_KEYLEN) return false

  const derivedKey = await scryptAsync(password, salt, { N: NNum, r: rNum, p: pNum })
  return timingSafeEqual(storedHash, derivedKey)
}

export function generateResetToken(): string {
  return randomBytes(32).toString('hex')
}
