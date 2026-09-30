import { NextResponse } from 'next/server';
import { getGenerationStatus } from '@/lib/rate-limit';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const status = await getGenerationStatus(userId);

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
