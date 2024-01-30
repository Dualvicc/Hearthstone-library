import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { TCard, TCardData } from '@/types';

const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
const cardsPath = 'cards';
const BASE_URL = `${apiEndpoint}${cardsPath}`;
const PAGE_SIZE = 100;

const cookieStore = cookies();
const accessToken = cookieStore.get('access_token');

const requestOptions: RequestInit = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  },
  body: 'grant_type=client_credentials',
};

type TParams = Record<string, string>;

export const getCards = async ({
  page = 1,
  manaCostParam = '',
  healthParam = '',
  attackParam = '',
  cardSetParam = 'standard',
  classParam = 'all',
  spellSchoolParam = '',
  rarityParam = '',
  keywordParam = '',
  typeParam = '',
  minionTypeParam = '',
  textFilterParam = '',
  gameModeParam = '',
  sortParam = 'manaCost:asc,name:asc,classes:asc,groupByClass:asc',
}) => {
  try {
    const defaultParams: TParams = {
      class: classParam,
      textFilter: textFilterParam,
      manaCost: manaCostParam,
      health: healthParam,
      attack: attackParam,
      spellSchool: spellSchoolParam,
      rarity: rarityParam,
      keyword: keywordParam,
      type: typeParam,
      minionType: minionTypeParam,
      locale: 'en_US',
      page: page.toString(),
      pageSize: PAGE_SIZE.toString(),
      sort: sortParam,
    };

    if (gameModeParam) {
      defaultParams.gameMode = gameModeParam;
    } else {
      defaultParams.set = cardSetParam;
    }

    // NOTE Filter out empty or undefined values from the params object
    const validParams = Object.entries(defaultParams).reduce((acc, [key, value]) => {
      if (value !== '' && value !== undefined) {
        acc[key] = value;
      }

      return acc;
    }, {} as TParams);

    // const response: AxiosResponse<TCardData> = await axiosInstance.get('', {
    //   params: validParams,
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // });
    const response = await fetch(`${BASE_URL}?${new URLSearchParams(validParams)}`, requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error en la API de Blizzard' }, { status: 500 });
  }
};

export async function GET(request: TParams) {
  return getCards(request);
}
