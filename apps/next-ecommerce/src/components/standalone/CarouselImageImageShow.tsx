'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

type CarouselImageImageShowProps = {
  imgData: {
    promotionalMessage1: string;
    promotionalMessage2: string;
    url: string;
    sliderImage: string | StaticImageData;
  };
};

const CarouselImageImageShow: React.FC<CarouselImageImageShowProps> = ({
  imgData,
}) => {
  return (
    <div className="slider-item relative h-full w-full">
      <div className="container relative flex h-full w-full items-center">
        <div className="text-content basis-1/2">
          <div className="text-sub-display">{imgData.promotionalMessage1}</div>
          <div className="text-display mt-2 md:mt-5">
            {imgData.promotionalMessage2}
          </div>
          <Link href={`${imgData.url}`} className="button-main mt-3 md:mt-8">
            Shop Now
          </Link>
        </div>
        <div className="sub-img absolute -right-[0] bottom-0 w-1/2 sm:-bottom-[60px] 2xl:-right-[60px]">
          <Image
            priority={true}
            src={`${imgData.sliderImage}`}
            width={670}
            height={805}
            alt="slider"
          />
        </div>
      </div>
    </div>
  );
};

export default CarouselImageImageShow;
