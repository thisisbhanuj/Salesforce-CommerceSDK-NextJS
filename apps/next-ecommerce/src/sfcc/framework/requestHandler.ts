import { NextRequest, NextResponse } from 'next/server';
import { RequestHandlerConfig } from '@repo/types-config/CommonTypes';
import applyMiddlewares from '@/middlewares/applyMiddleware';

export const createRequestHandler = (config: RequestHandlerConfig) => {
  return async (
    req: NextRequest,
    res: NextResponse,
    params?: { params: Record<string, any> },
  ) => {
    try {
      if (config.method && req.method !== config.method) {
        return NextResponse.json(
          { error: 'Method not allowed' },
          { status: 405 },
        );
      }
      if (config.middlewares) {
        await applyMiddlewares(req, res, config.middlewares);
      }
      await config.handler(req, res, { params });
    } catch (error: any) {
      console.error('Error handling request:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }
  };
};
