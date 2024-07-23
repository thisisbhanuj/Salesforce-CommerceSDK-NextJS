'use client';

import React from 'react';

import Footer from '@/components/footer/Footer';
import ProductDisplayPage from '@/components/product/Detail/ProductDisplayPage';
import ProductHeader from '@/components/header/ProductHeader';
import { PrimaryCategory } from '@/Category';

import { usePDPStore } from '@/zustand/context/usePDPStore';
import { DesignStateType } from '@/DesignStateType';

interface Props {
  webPageDesignModel: DesignStateType;
  navModel: PrimaryCategory[] | undefined;
  masterProduct: any;
}

const Display: React.FC<Props> = ({
  webPageDesignModel,
  navModel,
  masterProduct,
}) => {
  const [state] = usePDPStore((state) => [state]);
  if (masterProduct && masterProduct !== state.productMain) {
    state.setProduct(masterProduct);
  }

  return (
    <>
      <ProductHeader
        productPage="default"
        skuId={masterProduct?.skuId}
        category={masterProduct?.category}
        navModel={navModel ?? []}
      />
      <ProductDisplayPage webPageDesignModel={webPageDesignModel} />
      <Footer />
    </>
  );
};

export default Display;
