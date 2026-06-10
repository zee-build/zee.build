import { NextRequest } from 'next/server'

/** Verify the x-admin-pin header against ADMIN_PIN. Returns true if authorized. */
export function isAdminRequest(req: NextRequest): boolean {
  const pin = req.headers.get('x-admin-pin')
  const adminPin = process.env.ADMIN_PIN
  return Boolean(adminPin) && pin === adminPin
}
