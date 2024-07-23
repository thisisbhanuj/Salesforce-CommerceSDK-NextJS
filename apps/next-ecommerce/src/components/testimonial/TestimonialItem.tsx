'use client';

import React from 'react';

import { TestimonialType } from '../../../types/TestimonialType';
import Rate from '../standalone/Rate';

interface TestimonialProps {
  data: TestimonialType;
}

const TestimonialItem: React.FC<TestimonialProps> = ({ data }) => {
  return (
    <div className="testimonial-item h-full">
      <div className="testimonial-main h-full rounded-2xl bg-white p-8">
        <Rate currentRate={data.star} size={14} />
        <div className="heading6 title mt-4">{data.title}</div>
        <div className="desc mt-2">{data.description}</div>
        <div className="text-button name mt-4">{data.name}</div>
        <div className="caption2 date mt-1 text-secondary2">{data.date}</div>
      </div>
    </div>
  );
};

export default TestimonialItem;
