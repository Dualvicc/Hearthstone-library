import type { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  return handler();
}
