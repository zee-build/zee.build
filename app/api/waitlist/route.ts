import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory storage (for development)
// In production, you'd want to use a database or external service
const waitlistEntries: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, childAge, product, timestamp } = body

    // Validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Check for duplicates
    const exists = waitlistEntries.find(entry => entry.email === email && entry.product === product)
    if (exists) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Store entry
    const entry = {
      email,
      childAge: childAge || null,
      product: product || 'nutrinest',
      timestamp: timestamp || new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
    }

    waitlistEntries.push(entry)

    // Log to console (in production, send to analytics/email service)
    console.log('[Waitlist] New submission:', entry)

    // TODO: Send email notification
    // You can integrate with Resend, SendGrid, or any email service here
    // Example with Resend (requires setup):
    // await resend.emails.send({
    //   from: 'NutriNest <noreply@zee.build>',
    //   to: email,
    //   subject: 'Welcome to NutriNest Waitlist',
    //   html: '<p>Thanks for joining!</p>'
    // })

    return NextResponse.json(
      { success: true, message: 'Successfully joined waitlist' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Waitlist] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint to view submissions (protect this in production!)
export async function GET(request: NextRequest) {
  // Simple auth check (replace with proper auth in production)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== 'Bearer dev-secret-key') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  return NextResponse.json({
    total: waitlistEntries.length,
    entries: waitlistEntries,
  })
}
