import { NextRequest, NextResponse } from 'next/server';
import { signOut } from '@/lib/motoscout/auth';
import { redirect } from 'next/navigation';

export async function POST(request: NextRequest) {
  try {
    await signOut();
    return NextResponse.redirect(new URL('/motoscout/login', request.url));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
