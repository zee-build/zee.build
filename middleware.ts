import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const isLearnRoute = req.nextUrl.pathname.startsWith('/learn');
  const isAuthRoute = req.nextUrl.pathname.startsWith('/auth');
  const isCertRoute = req.nextUrl.pathname.startsWith('/certificate');
  const isWaitlist = req.nextUrl.pathname === '/waitlist';
  const isApi = req.nextUrl.pathname.startsWith('/api');

  if (isCertRoute || isWaitlist || isAuthRoute || isApi) {
    return NextResponse.next();
  }

  let res = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (isLearnRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    const { data: allowed } = await supabase
      .from('allowed_users')
      .select('id')
      .eq('email', user.email)
      .single();

    if (!allowed) {
      return NextResponse.redirect(new URL('/waitlist', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/learn/:path*', '/auth/:path*', '/certificate/:path*'],
};
