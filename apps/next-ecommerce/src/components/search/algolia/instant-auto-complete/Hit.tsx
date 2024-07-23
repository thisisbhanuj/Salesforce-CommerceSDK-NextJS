'use client';

import { Snippet } from 'react-instantsearch-hooks-web';
import { ProductHit } from '@/SearchType';
import Product from '@/components/product/Product';

type HitProps = {
  hit: ProductHit;
};

export function Hit({ hit }: Readonly<HitProps>) {
  return (
    <>
      <Product key={hit.objectID} type="grid" data={hit} />
      <div>
        <h1>
          <Snippet hit={hit} attribute="name" />
        </h1>
      </div>
    </>
  );
}
