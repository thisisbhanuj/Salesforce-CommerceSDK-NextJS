import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';

import connectDB from '@/lib/db';
import { Product } from '@/models/productModel';

export async function GET(request: NextRequest) {
  const skuId = request.nextUrl.searchParams.get('id');

  try {
    await connectDB();
    const product = await Product.findOne({ id: skuId });
    if (!product) {
      return NextResponse.json(
        { message: `Product ${skuId} not found` },
        { status: HttpStatusCode.NotFound },
      );
    }
    return NextResponse.json(
      { masterProduct: product },
      { status: HttpStatusCode.Ok },
    );
  } catch (error) {
    console.error(`Error fetching product ${skuId}`, error);
    return NextResponse.json(
      { message: `Error fetching product ${skuId}` },
      { status: HttpStatusCode.InternalServerError },
    );
  }
}
