'use client';

import React from 'react';

import reviewData from '@/data/Testimonial.json';
import TestimonialItem from '@/components/testimonial/TestimonialItem';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';

const CustomerFeedbacks = () => {
  return (
    <>
      {/* <Header heading='Customer Feedbacks'  navModel={[]} subHeading=''/> */}
      <div className="customer-feedbacks py-10 md:py-20">
        <div className="container">
          <div className="list-review grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-[30px] lg:grid-cols-3">
            {reviewData.map((item) => (
              <TestimonialItem key={item.id} data={item} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CustomerFeedbacks;
