import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';

import connectDB from '@/lib/db';
import CarouselModel from '@/models/carouselModel';

export async function GET(request: NextRequest) {
  const pageName = request.nextUrl.searchParams.get('page');

  try {
    await connectDB();
    const carousel = await CarouselModel.findOne({ page: pageName }).lean();
    if (carousel) {
      return NextResponse.json(carousel, { status: HttpStatusCode.Ok });
    } else {
      return NextResponse.json(
        { message: 'Page not found' },
        { status: HttpStatusCode.NotFound },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error' },
      { status: HttpStatusCode.InternalServerError },
    );
  }
}
