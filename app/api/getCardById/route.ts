import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { TCardData } from '@/types';

const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
const cardsPath = 'cards';
const BASE_URL = `${apiEndpoint}${cardsPath}`;
const PAGE_SIZE = 100;

const cookieStore = cookies();
const accessToken = cookieStore.get('access_token');

export const handler = async (cardIds: number[]) => {
  try {
    const idParam = cardIds.join(',');

    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: idParam,
        locale: 'en_US',
        pageSize: PAGE_SIZE.toString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TCardData = await response.json();

    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export async function GET(): Promise<NextResponse> {
  return handler();
}
