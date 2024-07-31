'use server';

import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';
import PrivateClientConfigSingleton from '@repo/sfcc-scapi/src/clients/PrivateClientConfigSingleton';
import { convertJSONToModel } from '@repo/sfcc-scapi/src/helpers/searchHelper';
import { fetchProductsSearchSCAPI } from '@repo/sfcc-scapi/src/scapi/shopper/SearchService';
import applyMiddlewares from '@/middlewares/applyMiddleware';
import { validateShopperTokenMiddleware } from '@/middlewares/validateShopperTokenMiddleware';
import { AugmentedNextRequest } from '@repo/types-config/CommonTypes';

/**
 * Get products search using the ShopperSearch API.
 * @param request - The incoming request.
 * @returns Search results.
 * @throws Error if the search fails.
 */
export async function GET(request: AugmentedNextRequest) {
  const searchQuery = request.nextUrl.searchParams.get('query');
  if (!searchQuery) {
    return NextResponse.json(
      { error: 'Missing search query' },
      { status: HttpStatusCode.BadRequest },
    );
  }

  const clientConfig = PrivateClientConfigSingleton.getInstance(
    process.env.SITE_ID!,
  ).getClientConfig();

  // Apply the validateShopperTokenMiddleware middleware.
  await applyMiddlewares(request, undefined, [validateShopperTokenMiddleware]);

  const shopperToken = request.custom.shopperToken;
  if (!shopperToken) {
    return NextResponse.json(
      { error: 'Access token not found' },
      { status: HttpStatusCode.Unauthorized },
    );
  }

  try {
    const searchJSON = await fetchProductsSearchSCAPI(
      shopperToken,
      { query: searchQuery },
      clientConfig,
    );

    if (searchJSON) {
      const searchModel = await convertJSONToModel(searchJSON);

      console.debug('Search Model: ', searchModel);

      return NextResponse.json(
        { searchModel: searchModel },
        { status: HttpStatusCode.Ok },
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching access token: ${error.message}`);
    } else {
      throw new Error('Unexpected error while fetching access token');
    }
  }
}
