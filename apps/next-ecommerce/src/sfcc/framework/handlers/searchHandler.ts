import { NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { convertJSONToModel } from '@repo/sfcc-scapi/src/helpers/productHelper';
import {
  AugmentedNextRequest,
  ExtendedConfig,
} from '@repo/types-config/CommonTypes';
import { fetchProductsSearchSCAPI } from '@repo/sfcc-scapi/src/scapi/shopper/SearchService';

/**
 * Get product search details using the ShopperSearch API.
 * @param request - The request object.
 * @param response - The response object.
 * @param config - The configuration object.
 * @returns The product search details.
 */
export const productSearchHandler = async (
  request: AugmentedNextRequest,
  response: NextResponse,
  config: ExtendedConfig<Record<string, any>>,
) => {
  const searchQuery = request.nextUrl.searchParams.get('query');
  if (!searchQuery) {
    return NextResponse.json(
      { error: 'Missing search query' },
      { status: HttpStatusCode.BadRequest },
    );
  }

  try {
    const searchJSON = await fetchProductsSearchSCAPI(
      config.shopperToken,
      { query: searchQuery },
      config.clientConfig,
    );

    if (searchJSON) {
      const searchModel = await convertJSONToModel(searchJSON);
      return NextResponse.json(
        { searchModel: searchModel },
        { status: HttpStatusCode.Ok },
      );
    }
  } catch (error: any) {
    console.error('Error fetching search details:', error);
    return NextResponse.json(
      { error: error.message },
      { status: HttpStatusCode.InternalServerError },
    );
  }
};
