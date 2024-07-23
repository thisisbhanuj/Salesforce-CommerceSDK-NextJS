import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { ProductType } from '../../../../types/ProductType';
import Product from '../Product';

interface Props {
  totalProducts: number;
  currentProducts: ProductType[];
  noProducts: boolean;
}

const PLPGrid: React.FC<Props> = ({
  totalProducts,
  currentProducts,
  noProducts,
}) => {
  return (
    <>
      {!!noProducts && (
        <div className="w-full text-center">
          <h2 className="flex justify-center text-2xl font-semibold">
            No products found.
          </h2>
          <p className="flex justify-center text-lg font-normal">
            Please try a different category.
          </p>
        </div>
      )}
      <div className="list-product hide-product-sold mt-7 grid gap-[20px] sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {totalProducts > 0 &&
          currentProducts.map((item) => (
            <Product key={item.skuId} data={item} type="grid" />
          ))}
        {currentProducts.length === 0 && !noProducts && (
          <>
            <Skeleton className="skeleton-tile" height={400} width="100%" />
            <Skeleton className="skeleton-tile" height={400} width="100%" />
            <Skeleton className="skeleton-tile" height={400} width="100%" />
            <Skeleton className="skeleton-tile" height={400} width="100%" />
            <Skeleton className="skeleton-tile" height={400} width="100%" />
            <Skeleton className="skeleton-tile" height={400} width="100%" />
          </>
        )}
      </div>
    </>
  );
};

export default PLPGrid;
