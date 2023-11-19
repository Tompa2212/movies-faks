import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from './lib/get-session';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/watchlist')) {
    const session = await getAuthSession();

    if (session === null) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }
}
