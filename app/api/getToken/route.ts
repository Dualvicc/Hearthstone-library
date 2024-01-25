import type { AxiosResponse } from 'axios';
import axios, { isAxiosError } from 'axios';
import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

const tokenEndpoint = process.env.NEXT_PUBLIC_TOKEN_ENDPOINT;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const ACCESS_TOKEN_COOKIE = 'access_token';
const TOKEN_EXPIRATION_COOKIE = 'token_expiration';

if (!tokenEndpoint || !clientId || !clientSecret) {
  throw new Error('Environment variables are not set');
}

const axiosInstance = axios.create({
  baseURL: tokenEndpoint,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  auth: {
    username: clientId,
    password: clientSecret,
  },
});

type TokenResponse = {
  access_token: string;
  expires_in: number;
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response: AxiosResponse<TokenResponse> = await axiosInstance.post(
      '',
      'grant_type=client_credentials'
    );

    const token = response.data.access_token;
    const expiresIn = response.data.expires_in;
    const expirationTime = Date.now() + expiresIn * 1000;

    res.setHeader('Set-Cookie', [
      serialize(ACCESS_TOKEN_COOKIE, token, { httpOnly: true }),
      serialize(TOKEN_EXPIRATION_COOKIE, expirationTime.toString(), { httpOnly: true }),
    ]);

    res.status(200).json({ token });
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.error('Generic error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export async function GET(request: NextApiRequest, response: NextApiResponse) {
  return handler(request, response);
}
