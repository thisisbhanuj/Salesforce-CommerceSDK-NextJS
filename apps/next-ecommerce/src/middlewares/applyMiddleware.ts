/* eslint-disable no-unused-vars */
import { NextResponse } from 'next/server';
import {
  AugmentedNextRequest,
  Middleware,
} from '@repo/types-config/CommonTypes';

/**
 * Applies each passed middleware function in sequence.
 * @param req - The NextRequest object.
 * @param res - The NextResponse object.
 * @param middlewares - An array of middleware functions.
 */
const applyMiddleware = async (
  req: AugmentedNextRequest,
  res: NextResponse | undefined,
  middlewares: Middleware[],
): Promise<void> => {
  for (const middleware of middlewares) {
    await new Promise<void>((resolve, reject) => {
      // Each middleware function performs a specific task and calls next() to pass control to the next middleware function
      middleware(req, res, (error?: Error) => {
        console.log('Executing Middleware : ', middleware);
        if (error) return reject(error);
        resolve();
      });
    });
  }
};

export default applyMiddleware;
