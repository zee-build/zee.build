import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const SESSION_COOKIE = 'rib_session'
const PENDING_COOKIE = 'rib_pending'
const SESSION_TTL = 60 * 60 * 24 * 180 // 180 days
const PENDING_TTL = 60 * 15 // 15 minutes

function getSecret(): string {
  return process.env.SESSION_SECRET || process.env.ADMIN_PIN || 'runitback-dev-secret'
}

function sign(value: string): string {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('hex')
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const candidate = crypto.scryptSync(password, salt, 64)
  const expected = Buffer.from(hash, 'hex')
  if (candidate.length !== expected.length) return false
  return crypto.timingSafeEqual(candidate, expected)
}

function buildToken(payload: string, ttlSeconds: number): string {
  const expiry = Date.now() + ttlSeconds * 1000
  const data = `${payload}|${expiry}`
  const sig = sign(data)
  return `${Buffer.from(data).toString('base64url')}.${sig}`
}

function readToken(token: string | undefined | null): string | null {
  if (!token) return null
  const dotIdx = token.lastIndexOf('.')
  if (dotIdx === -1) return null
  const dataB64 = token.slice(0, dotIdx)
  const sig = token.slice(dotIdx + 1)
  let data: string
  try {
    data = Buffer.from(dataB64, 'base64url').toString('utf8')
  } catch {
    return null
  }
  if (sign(data) !== sig) return null
  const sepIdx = data.lastIndexOf('|')
  if (sepIdx === -1) return null
  const payload = data.slice(0, sepIdx)
  const expiry = Number(data.slice(sepIdx + 1))
  if (!Number.isFinite(expiry) || Date.now() > expiry) return null
  return payload
}

// ── Session (logged-in player) ──────────────────────────────────────
export const SESSION_COOKIE_NAME = SESSION_COOKIE

export function setSessionCookie(res: NextResponse, playerId: string) {
  const token = buildToken(playerId, SESSION_TTL)
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL,
  })
}

export function readSession(req: NextRequest): string | null {
  return readToken(req.cookies.get(SESSION_COOKIE)?.value)
}

/** Same as readSession but for use in server components via next/headers cookies(). */
export function readSessionToken(token: string | undefined | null): string | null {
  return readToken(token)
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 })
}

// ── Pending registration (between Register -> Link-card) ───────────
export function setPendingCookie(res: NextResponse, username: string, passwordHash: string) {
  const token = buildToken(`${username}|${passwordHash}`, PENDING_TTL)
  res.cookies.set(PENDING_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: PENDING_TTL,
  })
}

export function readPendingCookie(req: NextRequest): { username: string; passwordHash: string } | null {
  const payload = readToken(req.cookies.get(PENDING_COOKIE)?.value)
  if (!payload) return null
  const sepIdx = payload.indexOf('|')
  if (sepIdx === -1) return null
  const username = payload.slice(0, sepIdx)
  const passwordHash = payload.slice(sepIdx + 1)
  if (!username || !passwordHash) return null
  return { username, passwordHash }
}

export function clearPendingCookie(res: NextResponse) {
  res.cookies.set(PENDING_COOKIE, '', { path: '/', maxAge: 0 })
}
