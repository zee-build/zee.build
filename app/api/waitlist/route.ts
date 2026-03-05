import { NextRequest, NextResponse } from 'next/server'

/**
 * GOOGLE FORM SETUP INSTRUCTIONS:
 * 
 * 1. Create a Google Form with these fields:
 *    - Email (Short answer, required)
 *    - Child Age in Months (Dropdown: 6-36)
 *    - Location (Multiple choice: UAE, Other)
 * 
 * 2. Get the Form ID and Entry IDs:
 *    a. Open your Google Form
 *    b. Click "Send" and get the form link
 *    c. Form ID is in the URL: https://docs.google.com/forms/d/e/{FORM_ID}/viewform
 *    d. Open the form in a new tab
 *    e. Open DevTools (F12) → Network tab
 *    f. Fill out the form and click Submit
 *    g. Look for a request to "formResponse"
 *    h. In the Form Data, you'll see entries like:
 *       - entry.123456789: email@example.com
 *       - entry.987654321: 12
 *       - entry.456789123: UAE
 *    i. Copy these entry IDs
 * 
 * 3. Set Environment Variables (Vercel + .env.local):
 *    GOOGLE_FORM_ID=your_form_id_here
 *    GOOGLE_FORM_EMAIL_ENTRY=123456789
 *    GOOGLE_FORM_AGE_ENTRY=987654321
 *    GOOGLE_FORM_LOCATION_ENTRY=456789123
 * 
 * 4. Link Form to Google Sheet:
 *    - In Google Forms, click "Responses" tab
 *    - Click the Google Sheets icon to create linked spreadsheet
 *    - All submissions will automatically appear in the sheet
 */

// Rate limiting: in-memory store (resets on serverless cold start - acceptable for MVP)
const rateLimitStore = new Map<string, number[]>()
const RATE_LIMIT_WINDOW = 10 * 60 * 1000 // 10 minutes
const RATE_LIMIT_MAX = 5 // max 5 submissions per IP per window

// Time-to-submit validation
const MIN_SUBMIT_TIME = 1500 // 1.5 seconds
const MAX_SUBMIT_TIME = 60 * 60 * 1000 // 1 hour

interface WaitlistPayload {
  email: string
  childAgeMonths?: number
  location?: string
  startedAt: number
  company?: string // honeypot
}

function getClientIP(request: NextRequest): string {
  // Try various headers for IP (Vercel provides x-forwarded-for)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIp) {
    return realIp
  }
  
  return 'unknown'
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitStore.get(ip) || []
  
  // Remove old timestamps outside the window
  const recentTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW)
  
  if (recentTimestamps.length >= RATE_LIMIT_MAX) {
    return false // rate limit exceeded
  }
  
  // Add current timestamp
  recentTimestamps.push(now)
  rateLimitStore.set(ip, recentTimestamps)
  
  return true
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    // Check environment variables
    const formId = process.env.GOOGLE_FORM_ID
    const emailEntry = process.env.GOOGLE_FORM_EMAIL_ENTRY
    const ageEntry = process.env.GOOGLE_FORM_AGE_ENTRY
    const locationEntry = process.env.GOOGLE_FORM_LOCATION_ENTRY

    // Debug logging (never log actual values, only existence)
    console.log('[Waitlist API] Environment variables check:', {
      hasFormId: !!formId,
      hasEmailEntry: !!emailEntry,
      hasAgeEntry: !!ageEntry,
      hasLocationEntry: !!locationEntry
    })

    if (!formId || !emailEntry || !ageEntry || !locationEntry) {
      console.error('[Waitlist API] Missing environment variables')
      return NextResponse.json(
        { 
          error: 'Server configuration error. Please contact support.',
          details: 'Missing GOOGLE_FORM_* environment variables'
        },
        { status: 500 }
      )
    }

    // Parse request body
    const body: WaitlistPayload = await request.json()
    const { email, childAgeMonths, location, startedAt, company } = body

    // 1. HONEYPOT CHECK
    if (company) {
      console.log('Honeypot triggered:', { email, company })
      // Return success to not alert bot
      return NextResponse.json({ success: true })
    }

    // 2. VALIDATE EMAIL
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    // 3. TIME-TO-SUBMIT CHECK
    const now = Date.now()
    const timeToSubmit = now - startedAt

    if (timeToSubmit < MIN_SUBMIT_TIME) {
      console.log('Submission too fast:', { email, timeToSubmit })
      return NextResponse.json(
        { error: 'Please take your time filling out the form.' },
        { status: 400 }
      )
    }

    if (timeToSubmit > MAX_SUBMIT_TIME) {
      console.log('Submission too slow:', { email, timeToSubmit })
      return NextResponse.json(
        { error: 'Form session expired. Please refresh and try again.' },
        { status: 400 }
      )
    }

    // 4. RATE LIMITING
    const clientIP = getClientIP(request)
    if (!checkRateLimit(clientIP)) {
      console.log('Rate limit exceeded:', { ip: clientIP, email })
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      )
    }

    // 5. FORWARD TO GOOGLE FORM
    const formData = new URLSearchParams()
    formData.append(`entry.${emailEntry}`, email)
    
    if (childAgeMonths) {
      formData.append(`entry.${ageEntry}`, childAgeMonths.toString())
    }
    
    if (location) {
      formData.append(`entry.${locationEntry}`, location)
    }

    const googleFormUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`

    console.log('[Waitlist API] Submitting to Google Forms:', { 
      url: googleFormUrl.substring(0, 50) + '...', // Only log partial URL
      hasEmail: !!email,
      hasAge: !!childAgeMonths,
      hasLocation: !!location
    })

    const response = await fetch(googleFormUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      redirect: 'manual', // Don't follow redirects
    })

    // Log response status
    console.log('[Waitlist API] Google Forms response:', { 
      status: response.status,
      statusText: response.statusText
    })

    // Even if Google returns an error, we'll consider it successful
    // Check your Google Sheet to verify submissions are coming through

    console.log('Waitlist submission processed:', { 
      email, 
      childAgeMonths, 
      location,
      ip: clientIP,
      googleStatus: response.status 
    })

    // Analytics event (replace with your analytics service)
    console.log('[ANALYTICS] submit_waitlist_success', { email, location, childAgeMonths })

    return NextResponse.json({ 
      success: true,
      message: 'Successfully joined the waitlist!' 
    })

  } catch (error) {
    console.error('Waitlist API error:', error)
    
    // Analytics event
    console.log('[ANALYTICS] submit_waitlist_error', { error: String(error) })

    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
