import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import images from '@/utility/localImageHelper';

const Banner = () => {
  return (
    <div className="banner-block">
      <Link
        href={'/category/all'}
        className="banner-item relative block overflow-hidden duration-500"
      >
        <div className="banner-img">
          <Image
            priority={true}
            src={images.banner.banner2}
            // width={2000}
            // height={1300}
            alt="banner2"
            className="duration-1000"
          />
        </div>
        <div className="banner-content absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center">
          <div className="heading2 text-black">Best Sellers</div>
          <div className="text-button relative mt-2 inline-block border-b-2 border-black pb-1 text-black duration-500">
            Shop Now
          </div>
        </div>
      </Link>
      <Link
        href={'/category/all'}
        className="banner-item relative block overflow-hidden duration-500"
      >
        <div className="banner-img">
          <Image
            priority={true}
            src={images.banner.banner3}
            // width={2000}
            // height={1300}
            alt="banner3"
            className="duration-1000"
          />
        </div>
        <div className="banner-content absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center">
          <div className="heading2 text-black">New Arrivals</div>
          <div className="text-button relative mt-2 inline-block border-b-2 border-black pb-1 text-black duration-500">
            Shop Now
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Banner;
