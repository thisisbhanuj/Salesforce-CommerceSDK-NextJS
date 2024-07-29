'use server';

import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import PrivateClientConfigSingleton from '@repo/sfcc-scapi/src/clients/PrivateClientConfigSingleton';
import { convertJSONToModel } from '@repo/sfcc-scapi/src/helpers/productHelper';
import { findAccessTokenInRedisKV } from '@repo/sfcc-scapi/src/helpers/authHelper';
import { getSessionIDfromRequest } from '@repo/sfcc-scapi/src/helpers/requestHelper';
import { fetchProductSCAPI } from '@repo/sfcc-scapi/src/scapi/shopper/ProductService';

/**
 * Get product details using the ShopperProducts API.
 * @param params - The product ID.
 * @returns The product details.
 * @throws Error if the product details are missing.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } },
) {
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
    const productJSON = await fetchProductSCAPI(
      accessToken,
      params,
      clientConfig,
    );
    if (productJSON) {
      const productModel = convertJSONToModel(productJSON);
      return NextResponse.json(
        { productModel: productModel },
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
