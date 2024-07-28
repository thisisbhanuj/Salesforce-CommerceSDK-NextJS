"use server";

import { Variant } from "@repo/types-config/CommonTypes";

/**
 * Convert the product JSON to a model.
 * @param productJSON - The product JSON.
 * @returns The product model.
 */
export async function convertJSONToModel(productJSON: any) {
  return {
    id: productJSON.id,
    type: productJSON.type,
    master: productJSON.master,
    name: productJSON.name,
    variants: productJSON?.variants?.map((variant: Variant) => ({
      id: variant.productId,
      variationValues: variant.variationValues,
      price: variant.price,
    })),
    variationAttributes: productJSON.variationAttributes,
    shortDescription: productJSON.shortDescription,
    longDescription: productJSON.longDescription,
    primaryCategoryId: productJSON.primaryCategoryId,
    imageGroups: productJSON.imageGroups,
    inventory: productJSON.inventory,
  };
}
