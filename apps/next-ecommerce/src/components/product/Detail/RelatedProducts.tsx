'use client';

import React from 'react';
import Product from '../Product';
import { usePDPStore } from '@/zustand/context/usePDPStore';

interface Props {}

const RelatedProducts: React.FC<Props> = () => {
  const [productMain] = usePDPStore((state) => [state.productMain]);

  return (
    <section className="related-product py-10 md:py-20">
      <div className="container">
        <div className="heading3 text-center">Related Products</div>
        <div className="list-product hide-product-sold mt-6 grid grid-cols-2 gap-5 md:mt-10 md:gap-[30px] lg:grid-cols-4">
          {/* {productMain.slice(Number(productMain.skuId), Number(productMain.skuId) + 4).map((item, index) => (
                    <Product key={index} data={item} type='grid' />
                ))} */}
          {!!productMain && (
            <Product key={productMain.skuId} data={productMain} type="grid" />
          )}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
