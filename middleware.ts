import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const ACCESS_TOKEN_COOKIE = 'access_token';
const TOKEN_EXPIRATION_COOKIE = 'token_expiration';
const tokenEndpoint: string = 'http://localhost:3000/api/getToken';

export async function middleware() {
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE);
  const tokenExpiration = cookieStore.get(TOKEN_EXPIRATION_COOKIE);

  if (!token || !tokenExpiration || Date.now() > parseInt(tokenExpiration.toString(), 10) - 60000) {
    try {
      await fetch(tokenEndpoint);

      return NextResponse.next();
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Error en la API de Blizzard' }, { status: 500 });
    }
  }

  return NextResponse.next();
}
