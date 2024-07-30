'use server';

import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import PrivateClientConfigSingleton from '@repo/sfcc-scapi/src/clients/PrivateClientConfigSingleton';
import { convertJSONToModel } from '@repo/sfcc-scapi/src/helpers/productHelper';
import { findAccessTokenInRedisKV } from '@repo/sfcc-scapi/src/helpers/authHelper';
import { getSessionIDfromRequest } from '@repo/sfcc-scapi/src/helpers/requestHelper';
import { fetchProductSCAPI } from '@/sfcc/services/ProductService';

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
    console.error('Missing session ID');
    return NextResponse.json(
      { error: 'Missing session ID' },
      { status: HttpStatusCode.BadRequest },
    );
  }

  const accessToken = await findAccessTokenInRedisKV(sessionId);
  if (!accessToken) {
    console.error('Access token not found in REDIS KV');
    return NextResponse.json(
      { error: 'Access token not found in REDIS KV' },
      { status: HttpStatusCode.Unauthorized },
    );
  }

  try {
    const productJSON = await fetchProductSCAPI(
      accessToken,
      params.productId,
      clientConfig,
    );
    if (productJSON) {
      const productModel = await convertJSONToModel(productJSON);
      console.debug('Product Model:', productModel);

      return NextResponse.json(
        { productModel: productModel },
        { status: HttpStatusCode.Ok },
      );
    } else {
      console.error(`Product not found: ${params.productId}`);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: HttpStatusCode.NotFound },
      );
    }
  } catch (error: any) {
    console.error('Error fetching product details:', error);
    return NextResponse.json(
      { error: error.message },
      { status: HttpStatusCode.InternalServerError },
    );
  }
}
