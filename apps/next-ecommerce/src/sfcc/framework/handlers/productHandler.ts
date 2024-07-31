import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { fetchProductSCAPI } from '@/sfcc/services/ProductService';
import { convertJSONToModel } from '@repo/sfcc-scapi/src/helpers/productHelper';
import PrivateClientConfigSingleton from '@repo/sfcc-scapi/src/clients/PrivateClientConfigSingleton';
import { getSessionIDfromRequest } from '@repo/sfcc-scapi/src/helpers/requestHelper';
import { findAccessTokenInRedisKV } from '@repo/sfcc-scapi/src/helpers/authHelper';

export const getProductHandler = async (
  req: NextRequest,
  res: NextResponse,
  params: { params: Record<string, any> | undefined }
) => {
  const productId = params?.params?.productId;
  if (!productId) {
    return NextResponse.json(
      { error: 'Product ID is required' },
      { status: HttpStatusCode.BadRequest },
    );
  }

  const clientConfig = PrivateClientConfigSingleton.getInstance(
    process.env.SITE_ID!,
  ).getClientConfig();

  const sessionId = await getSessionIDfromRequest(req);

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
      productId,
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
      console.error(`Product not found: ${productId}`);
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
};
