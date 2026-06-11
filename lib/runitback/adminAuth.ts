import { NextRequest } from 'next/server'
import { createServiceClient } from './supabase'
import { readSession } from './playerAuth'

/** Verify the x-admin-pin header against ADMIN_PIN. Returns true if authorized. */
export function isAdminRequest(req: NextRequest): boolean {
  const pin = req.headers.get('x-admin-pin')
  const adminPin = process.env.ADMIN_PIN
  return Boolean(adminPin) && pin === adminPin
}

/**
 * Authorized to log/edit matches: either the shared admin PIN, or a logged-in
 * player whose account has the 'mod' or 'admin' role.
 */
export async function isModRequest(req: NextRequest): Promise<boolean> {
  if (isAdminRequest(req)) return true

  const playerId = readSession(req)
  if (!playerId) return false

  const supabase = createServiceClient()
  const { data } = await supabase.from('players').select('role').eq('id', playerId).single()
  return data?.role === 'mod' || data?.role === 'admin'
}
