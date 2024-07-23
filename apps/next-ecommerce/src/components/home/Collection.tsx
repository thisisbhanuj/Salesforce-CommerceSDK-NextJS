'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

import images from '@/utility/localImageHelper';

const Collection = () => {
  const router = useRouter();

  const handleSubCategoryClick = (category: string, productType: string) => {
    router.push(`/category/${category}/${productType}`);
  };

  const productCollections = [
    {
      name: 'tops',
      imageURL: images.collections.collection4,
      alt: 'tops',
      category: 'women',
      subCategory: 'tops',
    },
    {
      name: 'sweatshirts',
      imageURL: images.collections.collection1,
      alt: 'sweatshirts',
      category: 'men',
      subCategory: 'sweatshirts',
    },
    {
      name: 'bottoms',
      imageURL: images.collections.collection5,
      alt: 'bottoms',
      category: 'women',
      subCategory: 'bottoms',
    },
    {
      name: 'dresses',
      imageURL: images.collections.collection3,
      alt: 'dresses',
      category: 'women',
      subCategory: 'dresses',
    },
  ];

  return (
    <section className="collection-block pt-5 md:pt-8">
      <div className="container">
        {/* <Fade bottom> */}
        <div className="heading3 text-center">Explore Collections</div>
        {/* </Fade> */}
      </div>
      <div className="list-collection section-swiper-navigation mt-6 px-4 sm:px-5 md:mt-10">
        <Swiper
          className="h-full"
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
              spaceBetween: 20,
            },
          }}
        >
          {productCollections.map((collection, index) => (
            <SwiperSlide key={collection.alt}>
              <button
                className="collection-item relative block cursor-pointer overflow-hidden rounded-2xl"
                onClick={() =>
                  handleSubCategoryClick(
                    collection.category,
                    collection.subCategory,
                  )
                }
              >
                <div className="bg-img">
                  <Image
                    priority={true}
                    src={collection.imageURL}
                    // width={1000}
                    // height={600}
                    alt={collection.alt}
                  />
                </div>
                <div className="collection-name heading5 bottom-4 w-[100px] rounded-xl bg-white py-1.5 text-center duration-500 sm:bottom-8 md:w-[160px] md:py-3 lg:w-[200px]">
                  {collection.name}
                </div>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Collection;
