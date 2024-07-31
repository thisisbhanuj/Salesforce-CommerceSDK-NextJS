'use server';

import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';
import PrivateClientConfigSingleton from '@repo/sfcc-scapi/src/clients/PrivateClientConfigSingleton';
import { convertJSONToModel } from '@repo/sfcc-scapi/src/helpers/productHelper';
import { fetchProductSCAPI } from '@/sfcc/services/ProductService';
import applyMiddlewares from '@/middlewares/applyMiddleware';
import { validateShopperTokenMiddleware } from '@/middlewares/validateShopperTokenMiddleware';
import { AugmentedNextRequest } from '@repo/types-config/CommonTypes';

/**
 * Get product details using the ShopperProducts API.
 * @param params - The product ID.
 * @returns The product details.
 * @throws Error if the product details are missing.
 */
export async function GET(
  request: AugmentedNextRequest,
  { params }: { params: { productId: string } },
) {
  // Apply the validateShopperTokenMiddleware middleware.
  await applyMiddlewares(request, undefined, [validateShopperTokenMiddleware]);

  const shopperToken = request.custom.shopperToken;
  if (!shopperToken) {
    console.error('Missing Shopper Token');
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: HttpStatusCode.Unauthorized },
    );
  }

  const clientConfig = PrivateClientConfigSingleton.getInstance(
    process.env.SITE_ID!,
  ).getClientConfig();

  try {
    // Fetch the product details from the SCAPI.
    const productJSON = await fetchProductSCAPI(
      shopperToken,
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

// const getRouteHandler: RequestHandlerConfig<ExtendedConfig<any>> = {
//   method: 'GET',
//   middlewares: [validateShopperTokenMiddleware],
//   handler: productHandler,
// };

// export const GET = createRequestHandler(getRouteHandler);
