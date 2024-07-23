import React from 'react';

import Display from '@/components/product/Detail/Display';
import {
  cachedFetchNavigationCategories,
  cachedFetchMasterProduct,
  cachedDetchPageDesign,
} from '@/cachefns/cachefns';
import { PrimaryCategory } from '@/Category';
import { DesignStateType } from '@/DesignStateType';

// Allow any cache option to be passed to fetch but
// if no option is provided then set the cache option to 'force-cache'.
// This means that even fetch requests after dynamic functions are considered static.
export const fetchCache = 'default-cache';

/**
 * Renders the product display page.
 * @param {Object} props - The component props.
 * @param {Object} props.params - The parameters object containing the SKU ID.
 * @param {string} props.params.skuId - The SKU ID of the product.
 * @returns {JSX} The rendered product display page.
 */
export default async function ProductDisplayPage({
  params,
}: {
  params: { skuId: string };
}) {
  const skuId = params.skuId;

  let navModel: PrimaryCategory[] = [];
  const navigation = await cachedFetchNavigationCategories();
  if (navigation?.categories) {
    navModel = navigation.categories;
  }

  let masterProduct = null;
  const response = await cachedFetchMasterProduct(skuId);
  if (response?.masterProduct) {
    masterProduct = response.masterProduct;
  }

  let webPageDesignModel: DesignStateType = await cachedDetchPageDesign(
    'pdp',
    false,
  );

  return (
    <Display
      navModel={navModel}
      masterProduct={masterProduct}
      webPageDesignModel={webPageDesignModel}
    />
  );
}
