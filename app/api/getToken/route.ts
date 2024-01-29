import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const tokenEndpoint = process.env.NEXT_PUBLIC_TOKEN_ENDPOINT;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const ACCESS_TOKEN_COOKIE = 'access_token';
const TOKEN_EXPIRATION_COOKIE = 'token_expiration';

if (!tokenEndpoint || !clientId || !clientSecret) {
  throw new Error('Environment variables are not set');
}

type TokenResponse = {
  access_token: string;
  expires_in: number;
};

const requestOptions: RequestInit = {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: 'grant_type=client_credentials',
};
const setCookies = (token: string, expirationTime: number) => {
  cookies().set({
    name: ACCESS_TOKEN_COOKIE,
    value: token,
    domain: 'http://localhost:3000',
    httpOnly: true,
  });
  cookies().set({
    name: TOKEN_EXPIRATION_COOKIE,
    value: expirationTime.toString(),
    domain: 'http://localhost:3000',
    httpOnly: true,
  });
};

async function handler() {
  try {
    const response = await fetch(tokenEndpoint, requestOptions);

    if (!response.ok) {
      throw new Error(`Failed to fetch token. Status: ${response.status}`);
    }

    const data: TokenResponse = await response.json();

    const token = data.access_token;
    const expiresIn = data.expires_in;
    const expirationTime = Date.now() + expiresIn * 1000;

    setCookies(token, expirationTime);

    return NextResponse.json({
      status: 200,
      body: { token, expiresIn },
    });
  } catch (error) {
    console.error(error, 'error en la api de blizzard');
    return NextResponse.json({ error: 'Error en la API de Blizzard' }, { status: 500 });
  }
}

export async function GET() {
  return handler();
}
