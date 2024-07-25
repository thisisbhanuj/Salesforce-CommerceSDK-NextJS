import { headers } from 'next/headers';
import { NextRequest } from 'next/server';

export function findIP(request: NextRequest) {
  const FALLBACK_IP_ADDRESS = request.ip! ?? '0.0.0.0';
  const forwardedFor = headers().get('x-forwarded-for')!;

  if (forwardedFor) {
    return forwardedFor.split(',')[0] ?? FALLBACK_IP_ADDRESS;
  }

  return headers().get('x-real-ip') ?? FALLBACK_IP_ADDRESS;
}

/**
 * @returns The base URL for the application.
 */
export const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_URL_DEV_API;
  } else {
    return process.env.NEXT_PUBLIC_URL_PROD_API;
  }
};
