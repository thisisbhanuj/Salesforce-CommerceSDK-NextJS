import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { findIP } from './network';

type RateLimitData = {
  count: number;
  lastReset: number;
};

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, '10 s'), // 5 requests from the same IP in 10 seconds
});

export async function rateLimitHandlerUsingVercelKVRedis(request: NextRequest) {
  const ip = findIP(request);

  const { success, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Rate limit exceeded' }),
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      },
    );
  }

  return new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'X-RateLimit-Limit': '5',
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString(),
    },
  });
}

const rateLimitMap = new Map<string, RateLimitData>();

export async function rateLimitHandler(request: NextRequest) {
  const ip = findIP(request);
  const limit: number = 5; // Limiting requests to 5 per minute per IP
  const windowMs: number = 10 * 1000; // 10 seconds

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, {
      count: 0,
      lastReset: Date.now(),
    });
  }

  const ipData = rateLimitMap.get(ip)!;

  if (Date.now() - ipData.lastReset > windowMs) {
    ipData.count = 0;
    ipData.lastReset = Date.now();
  }

  if (ipData.count >= limit) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Rate limit exceeded' }),
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': (ipData.lastReset + windowMs).toString(),
        },
      },
    );
  }

  ipData.count += 1;

  return new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': ipData.count.toString(),
      'X-RateLimit-Reset': (ipData.lastReset + windowMs).toString(),
    },
  });
}

