import { NextResponse } from 'next/server';
import {
  AugmentedNextRequest,
  ExtendedConfig,
  RequestHandlerConfig,
} from '@repo/types-config/CommonTypes';
import applyMiddlewares from '@/middlewares/applyMiddleware';
import { HttpStatusCode } from 'axios';
import PrivateClientConfigSingleton from '@repo/sfcc-scapi/src/clients/PrivateClientConfigSingleton';

export const createRequestHandler = <T extends Record<string, any> = {}>(
  requestConfig: RequestHandlerConfig<T>,
) => {
  return async (
    request: AugmentedNextRequest,
    response: NextResponse,
    config?: { params?: Record<string, any> },
  ) => {
    try {
      // Check if method is allowed
      if (requestConfig.method && request.method !== requestConfig.method) {
        return NextResponse.json(
          { error: 'Method not allowed' },
          { status: 405 },
        );
      }

      // Apply middlewares
      await applyMiddlewares(request, response, requestConfig.middlewares);

      // Check if shopper token is present
      const shopperToken = request.custom.shopperToken;
      if (!shopperToken) {
        console.error('Missing Shopper Token');
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: HttpStatusCode.Unauthorized },
        );
      }

      // Check if session ID is present
      const sessionId = request.custom.sessionId;
      if (!sessionId) {
        console.error('Missing session ID');
        return NextResponse.json(
          { error: 'Missing session ID' },
          { status: HttpStatusCode.BadRequest },
        );
      }

      // Check if handler is defined
      if (!requestConfig.handler) {
        return NextResponse.json(
          { error: 'Handler is not defined' },
          { status: 500 },
        );
      }

      const clientConfig = PrivateClientConfigSingleton.getInstance(
        process.env.SITE_ID!,
      ).getClientConfig();

      // Merge additional config properties
      const extendedConfig: ExtendedConfig<T> = {
        ...(config as T),
        shopperToken,
        sessionId,
        clientConfig,
      };

      // Call the handler with the extended config
      return await requestConfig.handler(request, response, extendedConfig);
    } catch (error: any) {
      console.error('Error handling request:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }
  };
};
