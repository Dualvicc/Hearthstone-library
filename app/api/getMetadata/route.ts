import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { TMetadata } from '@/types';

const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
const metadataPath = 'metadata';

const BASE_URL = `${apiEndpoint}${metadataPath}`;
const cookieStore = cookies();
const accessToken = cookieStore.get('access_token');
const apiUrl = `${BASE_URL}?locale=en_US`;

const requestOptions: RequestInit = {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
};

export const handler = async () => {
  try {
    if (!accessToken) {
      throw new Error('Access token not found in cookies');
    }

    const response: Response = await fetch(apiUrl, requestOptions);
    const data: TMetadata = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error en la API de Blizzard' }, { status: 500 });
  }
};

export async function GET(): Promise<NextResponse> {
  return handler();
}
