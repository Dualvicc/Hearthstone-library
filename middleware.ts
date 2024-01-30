import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface TokenResponse {
  status: number;
  body: {
    access_token: string;
    token_expiration: number;
  };
}
const tokenEndpoint: string = 'http://localhost:3000/api/getToken';
const ACCESS_TOKEN_COOKIE: string = 'access_token';
const TOKEN_EXPIRATION_COOKIE: string = 'token_expiration';

export async function middleware(): Promise<NextResponse> {
  const response = NextResponse.next();
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE);
  const tokenExpiration = cookieStore.get(TOKEN_EXPIRATION_COOKIE);

  if (!token || !tokenExpiration || Date.now() > parseInt(tokenExpiration.toString(), 10) - 60000) {
    try {
      const routeResponse: Response = await fetch(tokenEndpoint);
      const data: TokenResponse = await routeResponse.json();
      response.cookies.set(ACCESS_TOKEN_COOKIE, data.body.access_token);
      response.cookies.set(TOKEN_EXPIRATION_COOKIE, data.body.token_expiration.toString());
      return response;
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Error en la API de Blizzard' }, { status: 500 });
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
