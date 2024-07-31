import {
  AugmentedNextRequest,
  Middleware,
} from '@repo/types-config/CommonTypes';
import { NextResponse } from 'next/server';

export const loggerMiddleware: Middleware = async (
  req: AugmentedNextRequest,
  res: NextResponse | undefined,
  next: () => void,
) => {
  console.log(`${req.method} ${req.url}`);
  next();
};
