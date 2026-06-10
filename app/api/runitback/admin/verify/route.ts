import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { pin } = await req.json()
  const adminPin = process.env.ADMIN_PIN

  if (!adminPin || pin !== adminPin) {
    return NextResponse.json({ error: 'Incorrect PIN' }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
