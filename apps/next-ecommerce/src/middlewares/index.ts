import { validateShopperTokenMiddleware } from '@/middlewares/validateShopperTokenMiddleware';
import { loggerMiddleware } from './loggerMiddleware';

export const middlewares = [loggerMiddleware, validateShopperTokenMiddleware];