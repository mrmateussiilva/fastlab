import { NextResponse } from 'next/server';
import { getClientIp, getGenerationStatus } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const ip = getClientIp(req);
    const status = await getGenerationStatus(ip);

    return NextResponse.json(status);
  } catch (error) {
    console.error('Error in /api/generation-limit:', error);
    return NextResponse.json(
      {
        limit: 2,
        used: 0,
        remaining: 2,
        resetAt: null,
        retryAfter: 0,
        globalLimitReached: false,
      },
      { status: 200 }
    );
  }
}
