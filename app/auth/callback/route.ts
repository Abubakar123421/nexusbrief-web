import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createRouteSupabaseClient } from '@/lib/supabase/route';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  let response = NextResponse.redirect(new URL(next, request.url));

  if (code) {
    const supabase = await createRouteSupabaseClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);
    
    // Save the Google provider token in a secure cookie so the API can use it
    if (data.session?.provider_token) {
      response.cookies.set('google_provider_token', data.session.provider_token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600 // 1 hour expiration
      });
    }
  }

  return response;
}
