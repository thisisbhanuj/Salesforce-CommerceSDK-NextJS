import React, { useState, useEffect } from 'react';

import { ProductType } from '../../types/ProductType';
import axios from 'axios';

/**
 * Custom hook to fetch product data.
 * @param {string} skuId - The SKU ID of the product.
 * @returns {Object} An object containing the product data and loading state.
 * @returns {ProductType | undefined} Object property - productData: The product data.
 * @returns {boolean} Object property - isLoading: The loading state.
 */
export const useProduct = (
  skuId: string,
): { productData: ProductType | undefined; isLoading: boolean } => {
  const [productData, setProductData] = useState<ProductType>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (skuId && skuId !== 'undefined') {
      const fetchProduct = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`/api/product?id=${skuId}`);
          setProductData(response.data.product);
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProduct();
    }

    return () => {}; // Clean-up function
  }, [skuId]);

  return { productData, isLoading };
};

export default useProduct;
