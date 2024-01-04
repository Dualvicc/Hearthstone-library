// getToken.ts
import type { AxiosResponse } from 'axios';
import axios, { isAxiosError } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const tokenEndpoint = process.env.NEXT_PUBLIC_TOKEN_ENDPOINT;

const axiosInstance = axios.create({
  baseURL: tokenEndpoint,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  auth: {
    username: clientId || '',
    password: clientSecret || '',
  },
});

type TokenResponse = {
  access_token: string;
  expires_in: number;
};

// eslint-disable-next-line consistent-return
export async function getToken(req: NextApiRequest, res: NextApiResponse) {
  try {
    const storedToken = localStorage.getItem('access_token');
    const storedTokenExpiration = localStorage.getItem('token_expiration');

    if (storedToken && storedTokenExpiration) {
      const currentTime = Date.now();
      const expirationTime = parseInt(storedTokenExpiration, 10);

      if (currentTime < expirationTime) {
        if (res) {
          return res.status(200).json({ token: storedToken });
        }
      }
    }

    const response: AxiosResponse<TokenResponse> = await axiosInstance.post(
      '',
      'grant_type=client_credentials'
    );

    const token = response.data.access_token;
    const expiresIn = response.data.expires_in;
    const expirationTime = Date.now() + expiresIn * 1000;

    localStorage.setItem('access_token', token);
    localStorage.setItem('token_expiration', expirationTime.toString());

    if (res) {
      return res.status(200).json({ token });
    }
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Generic error:', error);
    }

    if (res) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
