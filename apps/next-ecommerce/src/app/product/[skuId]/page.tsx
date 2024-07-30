import React from 'react';

import Display from '@/components/product/Detail/Display';
import {
  cachedFetchNavigationCategories,
  cachedFetchMasterProduct,
  cachedDetchPageDesign,
} from '@/cachefns/cachefns';
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
}: Readonly<{
  params: { skuId: string };
}>) {
  const skuId = params.skuId;
  const navModel = await cachedFetchNavigationCategories();

  let masterProduct = null;
  const response: any = await cachedFetchMasterProduct(skuId);
  if (response?.masterProduct) {
    masterProduct = response.masterProduct;
  }

  const webPageDesignModel: DesignStateType = await cachedDetchPageDesign(
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
