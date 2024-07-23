import { NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';

import connectDB from '@/lib/db';
import CategoryModel from '@/models/categoryModel';
import { PrimaryCategory } from '@/Category';

export async function GET() {
  try {
    await connectDB();

    // Fetch the existing root category
    const rootCategory = await CategoryModel.findOne({ category: 'root' });
    const activeCategories = rootCategory?.primaryCategories.filter(
      (primaryCategory) => !primaryCategory.hidden,
    );

    if (!activeCategories) {
      console.error('No categories found');
      return NextResponse.json(
        { message: `No categories found` },
        { status: HttpStatusCode.Unauthorized },
      );
    }

    if ((activeCategories as PrimaryCategory[])?.length > 0) {
      return NextResponse.json(
        { categories: activeCategories },
        { status: HttpStatusCode.Ok },
      );
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { message: `Error fetching categories` },
      { status: HttpStatusCode.Unauthorized },
    );
  }
}
