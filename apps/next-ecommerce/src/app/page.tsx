import React from 'react';

import TopNavigationComponent from '@/components/header/TopNavigationComponent';
import Menu from '@/components/header/menu/Menu';
import PageBuilder from '@/components/page-builder/PageBuilder';

import { getCurrentSession } from '@/lib/session';
import {
  cachedDetchPageDesign,
  cachedFetchNavigationCategories,
} from '@/cachefns/cachefns';
import { existingOrNewCart } from '@/actions/cart.actions';
import { PrimaryCategory } from '@/Category';
import { CartType } from '@/CartType';
import { DesignStateType } from '@/DesignStateType';

// Allow any cache option to be passed to fetch but
// if no option is provided then set the cache option to 'force-cache'.
// This means that even fetch requests after dynamic functions are considered static.
export const fetchCache = 'default-cache';

type CartContent =
  | {
      success: boolean | null;
      message: string | null;
      userCartModel: object | CartType | null;
    }
  | null
  | object
  | undefined;

export default async function Home() {
  const session = await getCurrentSession();

  let navModel: PrimaryCategory[] = [];
  navModel = await cachedFetchNavigationCategories();

  let cartContent: CartContent = null;
  cartContent = await existingOrNewCart();

  const webPageDesignModel: DesignStateType = await cachedDetchPageDesign(
    'home',
    false,
  );

  return (
    <>
      <TopNavigationComponent
        props="bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <Menu
          props="bg-transparent"
          session={session}
          navigation={navModel}
          cartContent={cartContent}
        />
      </div>
      <PageBuilder name="home" webPageDesignModel={webPageDesignModel} />
    </>
  );
}
