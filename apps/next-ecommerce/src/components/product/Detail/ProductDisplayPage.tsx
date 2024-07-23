'use client';

import React, { useEffect } from 'react';

import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css/bundle';
import SwiperCore from 'swiper/core';

import PageBuilder from '@/components/page-builder/PageBuilder';
import { DesignStateType } from '@/DesignStateType';

SwiperCore.use([Navigation, Thumbs]);

interface Props {
  webPageDesignModel: DesignStateType;
}

const ProductDisplayPage: React.FC<Props> = ({ webPageDesignModel }) => {
  useEffect(() => {
    window.document.addEventListener('click', () => {
      window.document
        .querySelector('.popover-content')
        ?.classList.remove('open');
    });
  }, []);

  return (
    <div className="product-detail">
      <div className="featured-product underwear py-10 md:py-20">
        <div className="container flex flex-wrap justify-between gap-y-6">
          <PageBuilder name="pdp" webPageDesignModel={webPageDesignModel} />
        </div>
      </div>
    </div>
  );
};

export default ProductDisplayPage;
