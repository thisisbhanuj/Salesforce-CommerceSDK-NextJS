import React from 'react';

import { getCurrentSession } from '@/lib/session';
import {
  cachedFetchCategoryProducts,
  cachedFetchNavigationCategories,
} from '@/cachefns/cachefns';

import PLP from '@/components/product/Landing/PLP';
import TopNavigationComponent from '@/components/header/TopNavigationComponent';
import Menu from '@/components/header/menu/Menu';
import { PrimaryCategory } from '@/Category';

// Allow any cache option to be passed to fetch but
// if no option is provided then set the cache option to 'force-cache'.
// This means that even fetch requests after dynamic functions are considered static.
export const fetchCache = 'default-cache';

type Props = {
  params: { slug: [] };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ProductLandingPage({
  params,
  searchParams,
}: Props) {
  const session = await getCurrentSession();

  let navModel: PrimaryCategory[] = [];
  const navigation = await cachedFetchNavigationCategories();
  if (navigation) {
    navModel = navigation;
  }

  const category = (params.slug as string[])[0] ?? 'men';
  const productType = (params.slug as string[])[1] ?? 'all';
  let noProducts = false;
  // eslint-disable-next-line prettier/prettier
  const productModelCollection = await cachedFetchCategoryProducts(
    category,
    productType,
  );
  if (!productModelCollection) {
    console.error(`No products found for ${category}/${productType}`);
    noProducts = true;
  }

  return (
    <>
      <TopNavigationComponent
        props="bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <Menu props="bg-transparent" session={session} navigation={navModel} />
      </div>
      <PLP
        slug={params.slug}
        queryString={searchParams}
        products={productModelCollection}
        noProducts={noProducts}
      />
    </>
  );
}

//************************************/
//      Category Classifications
//************************************/
// ProductType:
//  Defines the structure of a product type (e.g., "tshirt", "dress", "top").
//  It contains the ProductModel objects to hold the products of that type.
// SubCategory:
//  Represents product type (e.g., "T-Shirts", "Dresses") array with its name as key
// PrimaryCategory:
//  Represents a primary category (e.g., "Men", "Women") with its name and
//  an array of ProductType objects to hold the product types belonging to that category.
// RootCategory:
//  Defines the root category containing the "category" property (always "root") and
//  an array of PrimaryCategory objects for the primary categories within the root.
//************************************/
