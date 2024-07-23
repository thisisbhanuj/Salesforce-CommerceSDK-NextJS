'use client';

import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import 'swiper/css/effect-fade';

import { cachedCarouselData } from '@/cachefns/cachefns';
import CarouselImageImageShow from './CarouselImageImageShow';
import { CarouselImageType } from '@/CarouselType';

type CarouselProps = {
  pageName: string;
  position: string;
};

const Carousel = ({ pageName, position }: CarouselProps) => {
  const [carouselImages, setCarouselImages] = React.useState<
    CarouselImageType[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await cachedCarouselData(pageName, position, true);
      if (data) {
        setCarouselImages(data);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="slider-block bg-linear h-[400px] w-full max-sm:h-[325px] sm:h-[500px] md:h-[550px] lg:h-[720px]">
      <div className="slider-main h-full w-full">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          slidesPerGroup={1}
          loop={false}
          pagination={{ clickable: true }}
          modules={[Pagination, Autoplay]}
          className="relative h-full"
          autoplay={{
            delay: 4000,
          }}
        >
          {carouselImages.map((image, index) => (
            <SwiperSlide key={image.id}>
              <CarouselImageImageShow imgData={image} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Carousel;
