'use client';

import React from 'react';
import Link from 'next/link';
import * as Icon from '@phosphor-icons/react/dist/ssr';
import { useRouter } from 'next/navigation';

interface Props {
  productPage: string | null;
  skuId: string | number | null;
  category: string | null | undefined;
}

const BreadcrumbProduct: React.FC<Props> = ({
  productPage,
  skuId,
  category,
}) => {
  const router = useRouter();

  const handleDetailProduct = (skuId: string | number | null) => {
    router.push(`/product/${skuId}`);
  };

  return (
    <div className="breadcrumb-product">
      <div className="main bg-surface pb-[14px] pt-[70px] md:pt-[88px]">
        <div className="container flex flex-wrap items-center justify-between gap-3">
          <div className="left flex items-center gap-1">
            <Link
              href={'/'}
              className="caption1 text-secondary2 hover:underline"
            >
              Home
            </Link>
            <Icon.CaretRight size={12} className="text-secondary2" />
            <div className="caption1 text-secondary2">
              <Link
                href={`/category/${category}`}
                className="caption1 capitalize text-secondary2 hover:underline"
              >{`${category}`}</Link>
            </div>
            <Icon.CaretRight size={12} className="text-secondary2" />
            <div className="caption1 capitalize">
              <Link
                href={`/product/${skuId}`}
                className="caption1 text-secondary2 hover:underline"
              >{`${skuId}`}</Link>
            </div>
          </div>
          <div className="right flex items-center gap-3">
            {skuId !== null && Number(skuId) >= 2 ? (
              <>
                <button
                  onClick={() => handleDetailProduct(Number(skuId) - 1)}
                  className="flex cursor-pointer items-center border-r border-line pr-3 text-secondary hover:text-black"
                >
                  <Icon.CaretCircleLeft className="text-2xl text-black" />
                  <span className="caption1 pl-1">Previous Product</span>
                </button>
                <button
                  onClick={() => handleDetailProduct(Number(skuId) + 1)}
                  className="flex cursor-pointer items-center text-secondary hover:text-black"
                >
                  <span className="caption1 pr-1">Next Product</span>
                  <Icon.CaretCircleRight className="text-2xl text-black" />
                </button>
              </>
            ) : (
              <>
                {skuId !== null && Number(skuId) === 1 && (
                  <button
                    onClick={() => handleDetailProduct(Number(skuId) + 1)}
                    className="flex cursor-pointer items-center text-secondary hover:text-black"
                  >
                    <span className="caption1 pr-1">Next Product</span>
                    <Icon.CaretCircleRight className="text-2xl text-black" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreadcrumbProduct;
