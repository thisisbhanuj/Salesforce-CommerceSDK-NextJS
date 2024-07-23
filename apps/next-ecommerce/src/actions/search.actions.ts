'use server';

import { Product } from '@/models/productModel';
import connectDB from '@/lib/db';

export default async function search(searchTerm: string) {
  if (typeof searchTerm !== 'string') {
    return {
      success: false,
      status: 400,
      message: `Invalid search term ${searchTerm}`,
    };
  }

  try {
    await connectDB();
    const products = await Product.find({
      $text: { $search: searchTerm },
      master: true,
    });

    return {
      success: true,
      status: 200,
      message: 'Products Search Complete',
      searchModel: JSON.stringify(products),
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      message: `Error searching products with the given term ${searchTerm}`,
    };
  }
}
