//  It is a way to run logic before accessing any page, even when they are static. 
// On platforms like Vercel, Middleware is run at the Edge.

import { withAuth } from 'next-auth/middleware';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { rateLimitHandlerUsingVercelKVRedis } from '@/utility/rateLimiter';
import kafkaProvider from '@/kafka/provider';

/*
The `config` object is used to define the routes that should be protected by the middleware.
The `matcher` array should contain the routes that should be protected.
If a user is not logged in, the default behavior is to redirect them to the sign-in page.
*/
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/backoffice/:path*',
    '/profile/:path*',
    '/checkout/:path*',
    '/customization/:path*',
    '/threejs/:path*',
  ],
};

// [Documentation]https://next-auth.js.org/configuration/nextjs)
export default withAuth(
  async function middleware(req: NextRequest, event: NextFetchEvent) {
    await kafkaProvider(req, event)._edge_serverless(); // Send a message to a Kafka topic using edge serverless function.
    const rateLimitResponse = await rateLimitHandlerUsingVercelKVRedis(req); // Rate limit the request using Vercel KV Redis.
    return rateLimitResponse.status === 200
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/blocked', req.url));
  },
  {
    /*
    The pages configuration should match the same configuration in [...nextauth].ts.
    This is so that the next-auth Middleware is aware of your custom pages,
    so it won't end up redirecting to itself when an unauthenticated condition is met.
    */
    pages: {
      signIn: '/login',
      error: '/',
    },
  },
);
