/* eslint-disable no-unused-vars */
import { getUserSessionFormVercelKV } from '@repo/sfcc-scapi/src/kv/kvRestAPIManager';
import {
  AugmentedNextRequest,
  Middleware,
  ShopperSessionSCAPI,
} from '@repo/types-config/CommonTypes';
import { NextResponse } from 'next/server';

/**
 * Validate the shopper token.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 */
export const validateShopperTokenMiddleware: Middleware = async (
  req: AugmentedNextRequest,
  res: NextResponse | undefined,
  next: (error?: Error) => void,
) => {
  // Add the custom object to the request object if it does not exist.
  if (!req.custom) {
    req.custom = {};
  }

  try {
    const headerCookieObj = req.headers.get('cookie');
    if (headerCookieObj) {
      const sfccSessionDataCookieObj = headerCookieObj
        .split(';')
        .find((c) => c.trim().startsWith('sfccSessionData='));

      if (sfccSessionDataCookieObj) {
        let sfccSessionData = {} as ShopperSessionSCAPI;
        const jsonString = sfccSessionDataCookieObj.split('=')[1];
        try {
          if (jsonString && jsonString !== '{}') {
            sfccSessionData = JSON.parse(jsonString);

            const sessionId = sfccSessionData?.sessionId;
            if (!sessionId) {
              console.error('Missing sessionId');
              return next(new Error('Unauthorized'));
            }

            const userSession = await getUserSessionFormVercelKV(sessionId);
            if (!userSession?.access_token) {
              console.error('Missing access_token');
              return next(new Error('Unauthorized'));
            }

            if (userSession.access_token !== sfccSessionData.accessToken) {
              return next(new Error('Unauthorized'));
            }

            // Add the session ID and shopper token to the request object.
            if (userSession.sessionId) {
              req.custom.sessionId = userSession.sessionId;
            } else {
              console.error('Missing sessionId');
              return next(new Error('Unauthorized'));
            }
            req.custom.shopperToken = userSession.access_token;
          }
        } catch (e) {
          console.error('Failed to parse sfccSessionData:', e);
          next(new Error('Unauthorized'));
        }
      }
    }
    next();
  } catch (error: any) {
    next(error);
  }
};
