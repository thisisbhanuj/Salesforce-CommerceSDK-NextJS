'use server';

import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import PrivateClientConfigSingleton from '@repo/sfcc-scapi/src/clients/PrivateClientConfigSingleton';
import { convertJSONToModel } from '@repo/sfcc-scapi/src/helpers/searchHelper';
import { findAccessTokenInRedisKV } from '@repo/sfcc-scapi/src/helpers/authHelper';
import { getSessionIDfromRequest } from '@repo/sfcc-scapi/src/helpers/requestHelper';
import { fetchProductsSearchSCAPI } from '@repo/sfcc-scapi/src/scapi/shopper/SearchService';

/**
 * Get products search using the ShopperSearch API.
 * @param request - The incoming request.
 * @returns Search results.
 * @throws Error if the search fails.
 */
export async function GET(request: NextRequest) {
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

  const sessionId = await getSessionIDfromRequest(request);
  if (!sessionId) {
    return NextResponse.json(
      { error: 'Missing session ID' },
      { status: HttpStatusCode.BadRequest },
    );
  }
  const accessToken = await findAccessTokenInRedisKV(sessionId);
  if (!accessToken) {
    return NextResponse.json(
      { error: 'Access token not found' },
      { status: HttpStatusCode.Unauthorized },
    );
  }

  try {
    const searchJSON = await fetchProductsSearchSCAPI(
      accessToken,
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
