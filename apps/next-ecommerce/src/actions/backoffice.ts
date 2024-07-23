'use server';

import connectDB from '@/lib/db';
import PageDesign from '@/models/pageDesign';
import { revalidatePath } from 'next/cache';

export async function updatedPageDesignFormStateAction(
  prevState: { success: boolean; message: string; pageId: string },
  formData: FormData,
) {
  const pageId = prevState.pageId
    ? prevState.pageId
    : (formData.get('pageId') as string);

  try {
    await connectDB();

    const jsonData = formData.get('pageJSON') as string;

    if (!jsonData || jsonData === '') {
      console.log('Invalid JSON, please retry.');
      return {
        success: false,
        message: 'Invalid Page JSON, please retry.',
        pageId: pageId,
      };
    }

    const updates = JSON.parse(jsonData);

    const updatedPageDesign = await PageDesign.findOneAndUpdate(
      { name: pageId },
      updates,
      { new: true },
    );

    if (!updatedPageDesign) {
      console.log(
        'Page Design not updated, please retry with updateds : ',
        updates,
      );
      return {
        success: false,
        message: 'Page Design not updated, please retry.',
        pageId: pageId,
      };
    }

    console.log('Updted Design State : ', updatedPageDesign.toJSON());

    return {
      success: true,
      message: 'Page Design updated successfully.',
      pageId: pageId,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Page Design not updated, please retry.',
      pageId: pageId,
    };
  }
}

export async function clearFullRouterCache(pages: Set<string>) {
  try {
    pages.forEach((page) => {
      const route = page === 'home' ? '/' : `/${page}`;
      revalidatePath(route, 'page');
      console.info('Page Revalidated : ' + route);
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error('Something went wrong!');
  }
}
