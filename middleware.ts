import type { NextApiResponse } from 'next';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const tokenEndpoint = process.env.NEXT_PUBLIC_TOKEN_ENDPOINT || '';
const clientId = process.env.CLIENT_ID || '';
const clientSecret = process.env.CLIENT_SECRET || '';

const ACCESS_TOKEN_COOKIE = 'access_token';
const TOKEN_EXPIRATION_COOKIE = 'token_expiration';

if (tokenEndpoint === '' || clientId === '' || clientSecret === '') {
  throw new Error('Environment variables are not set');
}

type TokenResponse = {
  access_token: string;
  expires_in: number;
};

const requestOptions: RequestInit = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
  },
  body: 'grant_type=client_credentials',
};

async function getToken(res: NextApiResponse) {
  try {
    const response = await fetch(tokenEndpoint, requestOptions);

    if (!response.ok) {
      throw new Error('Response not OK');
    }

    const data: TokenResponse = await response.json();

    const token = data.access_token;
    const expiresIn = data.expires_in;
    const expirationTime = Date.now() + expiresIn * 1000;

    cookies().set({
      name: ACCESS_TOKEN_COOKIE,
      value: token,
      httpOnly: true,
    });
    cookies().set({
      name: TOKEN_EXPIRATION_COOKIE,
      value: expirationTime.toString(),
      httpOnly: true,
    });

    res.status(200).json({ token, expiresIn });
  } catch (error) {
    console.error('Fetch error:', 'error en la api de blizzard');
  }
}

export async function middleware(req: NextApiResponse, res: NextApiResponse) {
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE);
  const tokenExpiration = cookieStore.get(TOKEN_EXPIRATION_COOKIE);

  if (!token || !tokenExpiration || Date.now() > parseInt(tokenExpiration.toString(), 10) - 60000) {
    await getToken(res);
  }
  return NextResponse.next();
}
