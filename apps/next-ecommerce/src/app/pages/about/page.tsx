'use client';

import React from 'react';
import Image from 'next/image';

import Benefit from '@/components/home/Benefit';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';

const AboutUs = () => {
  return (
    <>
      {/* <Header heading='About Us' navModel={[]} subHeading=''/> */}
      <div className="about pt-10 md:pt-20">
        <div className="about-us-block">
          <div className="container">
            <div className="text flex items-center justify-center">
              <div className="content w-full md:w-5/6">
                <div className="heading3 text-center">
                  I{String.raw`'m`} obsessed with the dress Pippa Middleton wore
                  to her brother{String.raw`'s`} wedding.
                </div>
                <div className="body1 mt-5 text-center md:mt-7">
                  Kim Kardashian West needs no introduction. In the 14 years
                  since she first graced our screens in Keeping Up With The
                  Kardashians, she has built her KKW beauty empire, filmed her
                  show, wrapped her show, become a billionaire, studied law,
                  campaigned for the rights of death row inmates, travelled the
                  world to attend events such as Paris Fashion Week, raised four
                  children and launched her wildly successful shapewear brand
                  SKIMS.
                </div>
              </div>
            </div>
            <div className="list-img grid gap-[30px] pt-10 sm:grid-cols-3 md:pt-20">
              <div className="bg-img">
                <Image
                  priority={false}
                  src={'/images/other/410x550.png'}
                  width={2000}
                  height={3000}
                  alt="bg-img"
                  className="w-full rounded-[30px]"
                />
              </div>
              <div className="bg-img">
                <Image
                  priority={false}
                  src={'/images/other/410x550.png'}
                  width={2000}
                  height={3000}
                  alt="bg-img"
                  className="w-full rounded-[30px]"
                />
              </div>
              <div className="bg-img">
                <Image
                  priority={false}
                  src={'/images/other/410x550.png'}
                  width={2000}
                  height={3000}
                  alt="bg-img"
                  className="w-full rounded-[30px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Benefit props="md:pt-20 pt-10" />
      {/* <Newsletter props="bg-green md:mt-20 mt-10" />
            <Instagram /> */}
      <Footer />
    </>
  );
};

export default AboutUs;
