import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './lib/get-session';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/watchlist')) {
    const session = await getSession();

    console.log(session);

    if (session === null) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }
}
