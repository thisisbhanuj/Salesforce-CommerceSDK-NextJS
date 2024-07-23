'use client';

import React from 'react';

import PLPFacetsLeft from '@/components/product/Landing/PLPFacetsLeft';
import Footer from '@/components/footer/Footer';
import { ProductType } from '../../../../types/ProductType';

type Props = {
  slug: [] | string[] | undefined;
  queryString: { [key: string]: string | string[] | undefined };
  products: ProductType[];
  noProducts: boolean;
};

const PLP: React.FC<Props> = ({ slug, queryString, products, noProducts }) => {
  const category = (slug as string[])[0] ?? 'men';
  const productType = (slug as string[])[1] ?? 'all';
  const facets = queryString;

  return (
    <>
      <PLPFacetsLeft
        data={products}
        productPerPage={6}
        productType={productType}
        gender={null}
        category={category}
        facet={facets}
        noProducts={noProducts}
      />
      <Footer />
    </>
  );
};

export default PLP;
