'use server';

import { validateShopperTokenMiddleware } from '@/middlewares/validateShopperTokenMiddleware';
import {
  ExtendedConfig,
  RequestHandlerConfig,
} from '@repo/types-config/CommonTypes';
import { createRequestHandler } from '@/sfcc/framework/requestHandler';
import { productSearchHandler } from '@/sfcc/framework/handlers/searchHandler';

const getRouteHandler: RequestHandlerConfig<ExtendedConfig<any>> = {
  method: 'GET',
  middlewares: [validateShopperTokenMiddleware],
  handler: productSearchHandler,
};

export const GET = createRequestHandler(getRouteHandler);
