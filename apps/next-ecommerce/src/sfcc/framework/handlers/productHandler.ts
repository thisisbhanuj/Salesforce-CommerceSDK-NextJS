import { NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { fetchProductSCAPI } from '@/sfcc/services/ProductService';
import { convertJSONToModel } from '@repo/sfcc-scapi/src/helpers/productHelper';
import {
  AugmentedNextRequest,
  ExtendedConfig,
} from '@repo/types-config/CommonTypes';

export const productHandler = async (
  req: AugmentedNextRequest,
  res: NextResponse,
  config: ExtendedConfig<Record<string, any>>,
) => {
  // Extract productId from the URL
  const url = new URL(req.url);
  const productId = url.pathname.split('/').pop();

  if (!productId) {
    return NextResponse.json(
      { error: 'Product ID is required' },
      { status: HttpStatusCode.BadRequest },
    );
  }

  try {
    const productJSON = await fetchProductSCAPI(
      config.shopperToken,
      productId,
      config.clientConfig,
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
