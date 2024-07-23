'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

import Product from '../product/Product';
import { ProductType } from '../../../types/ProductType';

interface Props {
  data: Array<ProductType>;
  start: number;
  limit: number;
}

const TabFeatures: React.FC<Props> = ({ data, start, limit }) => {
  const [activeTab, setActiveTab] = useState<string>('on sale');

  const handleTabClick = (item: string) => {
    setActiveTab(item);
  };

  const getFilterData = () => {
    if (activeTab === 'on sale') {
      return data.filter(
        (product) => product.sale && product.category === 'fashion',
      );
    }

    if (activeTab === 'new arrivals') {
      return data.filter(
        (product) => product.new && product.category === 'fashion',
      );
    }

    if (activeTab === 'best sellers') {
      return data
        .filter((product) => product.category === 'fashion')
        .slice()
        .sort((a, b) => b.sold - a.sold);
    }

    return data;
  };

  const filteredProducts = getFilterData();

  return (
    <div className="tab-features-block pt-10 md:pt-20">
      <div className="container">
        <div className="heading flex flex-col items-center text-center">
          <div className="menu-tab flex items-center gap-2 rounded-2xl bg-surface p-1">
            {['best sellers', 'on sale', 'new arrivals'].map((item, index) => (
              <div
                key={index}
                className={`tab-item heading5 relative cursor-pointer px-5 py-2 text-secondary duration-500 hover:text-black ${activeTab === item ? 'active' : ''}`}
                onClick={() => handleTabClick(item)}
              >
                {activeTab === item && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-2xl bg-white"
                  ></motion.div>
                )}
                <span className="heading5 relative z-[1]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="list-product hide-product-sold section-swiper-navigation style-outline style-border mt-6 md:mt-10">
          <Swiper
            spaceBetween={12}
            slidesPerView={2}
            navigation
            loop={true}
            modules={[Navigation, Autoplay]}
            breakpoints={{
              576: {
                slidesPerView: 2,
                spaceBetween: 12,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1200: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
          >
            {filteredProducts.slice(start, limit).map((prd, index) => (
              <SwiperSlide key={index}>
                <Product data={prd} type="grid" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default TabFeatures;
