import { Product } from '@/models/productModel';

/**
 * Finds a SKU by its ID.
 * @param skuId - The ID of the SKU.
 * @returns The found SKU.
 */
export async function findSku(skuId: string) {
  return await Product.findOne({ id: skuId }).lean(true);
}
