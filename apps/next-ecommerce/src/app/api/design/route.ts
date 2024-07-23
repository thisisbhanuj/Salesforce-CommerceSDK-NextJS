import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';

import connectDB from '@/lib/db';
import PageDesign from '@/models/pageDesign';
import { DesignStateType, SectionType } from '@/DesignStateType';
import { sortSections } from '@/utility/pageBuilderHelper';

/**
 * Provides sorted sections based on the layout property to the frontend.
 * @param sections The sections to sort.
 * @returns The sorted sections.
 */
export async function GET(request: NextRequest) {
  const pageName = request.nextUrl.searchParams.get('page');

  try {
    await connectDB();

    // Fetch the page design
    const pageDesign = await PageDesign.findOne({ name: pageName }).lean();

    if (pageDesign?.sections?.length) {
      // Sort the sections based on the layout property
      const sortedSections = sortSections(pageDesign.sections);

      const frontendSections: SectionType[] = [];
      for (const section of sortedSections) {
        const frontendSection: SectionType = {
          id: section.id,
          componentPath: section.componentPath,
          type: section.type,
          content: section.content,
          breakpoints: section.breakpoints,
          layout: section.layout,
          order: section.order,
        };
        frontendSections.push(frontendSection);
      }

      const frontendPageDesign: DesignStateType = {
        name: pageDesign.name,
        id: pageDesign.id,
        componentPath: pageDesign.componentPath,
        sections: frontendSections,
        order: pageDesign.order,
      };

      return NextResponse.json(frontendPageDesign, {
        status: HttpStatusCode.Ok,
      });
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

//NOT USED
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { pageName, version } = body;

  try {
    await connectDB();

    const updates: { [key: string]: any } = {};

    const updatedPageDesign = await PageDesign.findOneAndUpdate(
      { name: pageName, version: version },
      updates,
      { new: true },
    );
    if (updatedPageDesign) {
      return NextResponse.json(updatedPageDesign, {
        status: HttpStatusCode.Ok,
      });
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
