import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';

import connectDB from '@/lib/db';
import { Product } from '@/models/productModel';
import { ProductType } from '@/ProductType';

/*
 * GET /api/category
 *
 * Fetches products based on the category and subcategory provided in the query string.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {NextResponse} - The response object.
 */
export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category');
  const subCategory = request.nextUrl.searchParams.get('subcategory');

  try {
    await connectDB();
    let products;
    if (category === 'all') {
      products = await Product.find({ master: true });
    } else if (subCategory === 'all') {
      products = await Product.find({ category, master: true });
    } else {
      products = await Product.find({
        category,
        productType: subCategory,
        master: true,
      });
    }

    if (products?.length === 0) {
      console.error(`No products found for ${category}/${subCategory}`);
      return NextResponse.json(
        {
          message: `No products found for ${category}/${subCategory}`,
          noProducts: true,
        },
        { status: HttpStatusCode.Accepted },
      );
    }

    if (products.length > 0) {
      const productsModel: ProductType[] = products.map((product) => ({
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

      console.debug(
        `Fetched products for ${category}/${subCategory}:`,
        products.length,
      );
      return NextResponse.json(
        { productsModel: productsModel },
        { status: HttpStatusCode.Ok },
      );
    } else {
      console.error(`No products found for ${category}/${subCategory}`);
      return NextResponse.json(
        { message: `No products found for ${category}/${subCategory}` },
        { status: HttpStatusCode.NotFound },
      );
    }
  } catch (error) {
    console.error(
      `Error fetching products for ${category}/${subCategory}:`,
      error,
    );
    return NextResponse.json(
      { message: `Error fetching products for ${category}/${subCategory}:` },
      { status: HttpStatusCode.InternalServerError },
    );
  }
}
