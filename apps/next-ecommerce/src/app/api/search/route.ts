import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';

import connectDB from '@/lib/db';
import { Product } from '@/models/productModel';
import { ProductType } from '@/ProductType';

export async function GET(request: NextRequest) {
  const searchTerm = request.nextUrl.searchParams.get('query');
  if (typeof searchTerm !== 'string') {
    return NextResponse.json(
      { message: `Invalid search term ${searchTerm}` },
      { status: HttpStatusCode.NotFound },
    );
  }

  try {
    await connectDB();
    const products = await Product.find({
      $text: { $search: searchTerm },
      master: true,
    });

    if (!products) {
      console.error(`No products found for ${searchTerm}`);
      return NextResponse.json(
        { message: `No products found for ${searchTerm}` },
        { status: HttpStatusCode.NotFound },
      );
    }

    if (products.length > 0) {
      const searchModel: ProductType[] = products.map((product) => ({
        id: product.id,
        productType: product.productType,
        skuId: product.skuId,
        name: product.name,
        price: product.price,
        images: product.images,
        category: product.category,
        variation: product.variation,
        description: product.description,
        rating: product.rating,
        numReviews: product.numReviews,
        color: product.color,
        colorCode: product.colorCode,
        sizes: product.sizes,
        inStock: product.inStock,
        sold: product.sold,
        available: product.available,
        gender: product.gender,
        material: product.material,
        new: product.new,
        sale: product.sale,
        master: product.master,
        parentProduct: product.parentProduct,
        quantity: product.quantity,
        slug: product.slug,
      }));

      console.debug(`Fetched products for ${searchTerm}:`, products.length);
      return NextResponse.json(
        { searchModel: searchModel },
        { status: HttpStatusCode.Ok },
      );
    } else {
      console.error(`No products found for ${searchTerm}`);
      return NextResponse.json(
        { message: `No products found for ${searchTerm}` },
        { status: HttpStatusCode.NotFound },
      );
    }
  } catch (error) {
    console.error(`Error fetching products for ${searchTerm}:`, error);
    return NextResponse.json(
      { message: `Error fetching products for ${searchTerm}:` },
      { status: HttpStatusCode.InternalServerError },
    );
  }
}
