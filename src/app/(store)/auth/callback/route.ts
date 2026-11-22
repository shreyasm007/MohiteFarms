import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirect = searchParams.get('redirect') || '/';

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      
      const response = isLocalEnv
        ? NextResponse.redirect(`${origin}${redirect}`)
        : NextResponse.redirect(`https://${forwardedHost || request.headers.get('host')}${redirect}`);

      // Set cookies on the response
      const cookieStore = request.cookies.getAll();
      cookieStore.forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value);
      });

      return response;
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
