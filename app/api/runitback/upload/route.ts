import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/runitback/supabase'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

const ALLOWED_EXTENSIONS: Record<string, string> = {
  jpg:  'image/jpeg',
  jpeg: 'image/jpeg',
  png:  'image/png',
  webp: 'image/webp',
  gif:  'image/gif',
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Photo must be smaller than 5MB.' }, { status: 400 })
  }

  // Derive the real extension from the filename
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  const contentType = ALLOWED_EXTENSIONS[ext]

  if (!contentType) {
    return NextResponse.json(
      { error: 'Photo must be a JPEG, PNG, WEBP or GIF.' },
      { status: 400 }
    )
  }

  const supabase = createServiceClient()
  const path = `${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from('player-avatars')
    .upload(path, await file.arrayBuffer(), { contentType })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data } = supabase.storage.from('player-avatars').getPublicUrl(path)

  return NextResponse.json({ url: data.publicUrl }, { status: 201 })
}
