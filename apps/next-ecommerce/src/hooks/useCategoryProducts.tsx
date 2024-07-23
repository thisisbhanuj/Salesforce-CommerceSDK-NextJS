import React, { useState, useEffect } from 'react';

import { ProductType } from '../../types/ProductType';
import axios from 'axios';

/**
 * Custom hook to fetch products based on category and product type.
 * @param {string} category - The parent category of the products.
 * @param {string} productType - Sub-category of the product.
 * @returns {Object} An object containing the fetched product data and loading state.
 * @returns {ProductType[]} Object.productModel - The fetched product data.
 * @returns {boolean} Object.isLoading - The loading state.
 */
export const useProducts = (
  category: string,
  productType: string | null,
): { productModelCollection: ProductType[]; isLoading: boolean } => {
  const [productModelCollection, setProductModelCollection] = useState<
    ProductType[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/api/category?category=${category}&productType=${productType}`,
        );
        setProductModelCollection(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    return () => {}; // Clean-up function
  }, [category, productType]);

  return { productModelCollection, isLoading };
};

export default useProducts;
