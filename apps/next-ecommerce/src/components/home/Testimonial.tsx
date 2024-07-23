'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';

import testimonialData from '@/data/Testimonial.json';
import TestimonialItem from '../testimonial/TestimonialItem';
import { TestimonialType } from '../../../types/TestimonialType';

interface Props {
  limit?: number;
}

const Testimonial: React.FC<Props> = ({ limit = 10 }) => {
  const data: TestimonialType[] = testimonialData;
  return (
    <div className="testimonial-block bg-surface py-10 md:py-20">
      <div className="container">
        <div className="heading3 text-center">What People Are Saying</div>

        <div className="list-testimonial pagination-mt40 mt-6 md:mt-10">
          <Swiper
            spaceBetween={12}
            slidesPerView={1}
            pagination={{ clickable: true }}
            loop={true}
            modules={[Pagination, Autoplay]}
            breakpoints={{
              680: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1200: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
          >
            {data?.slice(0, limit).map((prd, index) => (
              <SwiperSlide key={index}>
                <TestimonialItem data={prd} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
