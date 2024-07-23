'use client';

import React, { useState } from 'react';
import Image from 'next/image';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import SwiperCore from 'swiper/core';
import 'swiper/css/bundle';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import { usePDPStore } from '@/zustand/context/usePDPStore';

interface Props {}

const ImageContainer: React.FC<Props> = () => {
  const [productMain] = usePDPStore((state) => [state.productMain]);

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);
  const handleSwiper = (swiper: SwiperCore) => {
    setThumbsSwiper(swiper);
  };

  return (
    <div className="list-img w-full md:w-1/2 md:pr-[45px]">
      <Swiper
        about="main"
        slidesPerView={1}
        spaceBetween={0}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }} // https://github.com/nolimits4web/swiper/issues/5630
        modules={[Thumbs]}
        className="mySwiper2 overflow-hidden rounded-2xl"
      >
        {productMain?.images?.map((item, index) => (
          <SwiperSlide key={index}>
            <Image
              priority={false}
              src={item}
              width={1000}
              height={1000}
              alt="prd-img"
              className="aspect-[3/4] w-full object-cover"
            />
          </SwiperSlide>
        )) ?? <Skeleton count={1} height={800} width={600} />}
      </Swiper>
      <Swiper
        about="thumbs"
        onSwiper={handleSwiper}
        spaceBetween={0}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[Navigation, Thumbs]}
        className="mySwiper"
      >
        {productMain?.images?.map((item, index) => (
          <SwiperSlide key={index}>
            <Image
              priority={false}
              src={item}
              width={1000}
              height={1000}
              alt="prd-img"
              className="aspect-[3/4] w-full rounded-xl object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageContainer;
