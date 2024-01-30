import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const tokenEndpoint: string = process.env.NEXT_PUBLIC_TOKEN_ENDPOINT!;
const clientId: string = process.env.CLIENT_ID!;
const clientSecret: string = process.env.CLIENT_SECRET!;

if (!tokenEndpoint || !clientId || !clientSecret) {
  throw new Error('Environment variables are not set');
}

type TokenResponse = {
  access_token: string;
  expires_in: number;
};

const ACCESS_TOKEN_COOKIE: string = 'access_token';
const TOKEN_EXPIRATION_COOKIE: string = 'token_expiration';

const setCookies = (accessToken: string, tokenExpiration: number) => {
  const cookieStore = cookies();
  cookieStore.set({
    name: ACCESS_TOKEN_COOKIE,
    value: accessToken,
    httpOnly: true,
    secure: false,
  });
  cookieStore.set({
    name: TOKEN_EXPIRATION_COOKIE,
    value: tokenExpiration.toString(),
    httpOnly: true,
    secure: false,
  });
};

const requestOptions: RequestInit = {
  method: 'POST',
  headers: {
    Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: 'grant_type=client_credentials',
};

async function handler(): Promise<NextResponse> {
  try {
    const response = await fetch(tokenEndpoint, requestOptions);

    if (!response.ok) {
      throw new Error(`Failed to fetch token. Status: ${response.status}`);
    }

    const data: TokenResponse = await response.json();
    setCookies(data.access_token, Date.now() + data.expires_in * 1000);

    return NextResponse.json({
      status: 200,
      body: {
        access_token: data.access_token,
        token_expiration: Date.now() + data.expires_in * 1000,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error en la API de Blizzard' }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return handler();
}
