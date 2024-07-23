'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

import Product from '../product/Product';
import { ProductType } from '../../../types/ProductType';

interface Props {
  start: number;
  limit: number;
}

const WhatNew: React.FC<Props> = ({ start, limit }) => {
  const [activeTab, setActiveTab] = useState<string>('t-shirt');
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);

  const handleTabClick = (type: string) => {
    setActiveTab(type);
  };

  return (
    <div className="whate-new-block pt-10 md:pt-20">
      <div className="container">
        <div className="heading flex flex-col items-center text-center">
          <div className="heading3">What{String.raw`'s`} new</div>
          <div className="menu-tab mt-6 flex items-center gap-2 rounded-2xl bg-surface p-1">
            {['top', 't-shirt', 'dress', 'romper', 'hoodie'].map((type) => (
              <button
                key={type}
                className={`tab-item text-button-uppercase relative cursor-pointer px-5 py-2 text-secondary duration-500 hover:text-black ${activeTab === type ? 'active' : ''}`}
                onClick={() => handleTabClick(type)}
              >
                {activeTab === type && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-2xl bg-white"
                  ></motion.div>
                )}
                <span className="text-button-uppercase relative z-[1]">
                  {type}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="list-product hide-product-sold mt-6 grid grid-cols-2 gap-[20px] sm:gap-[30px] md:mt-10 lg:grid-cols-4">
          {filteredProducts.slice(start, limit).map((prd, index) => (
            <Product data={prd} type="grid" key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatNew;
