'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Footer from '@/components/footer/Footer';
import * as Icon from '@phosphor-icons/react/dist/ssr';
import Header from '@/components/header/Header';

const PageNotFound = () => {
  return (
    <>
      {/* <Header heading='Page Not Found'  navModel={[]} subHeading=''/> */}
      <div className="page-not-found bg-linear mt-14 py-10 md:mt-[74px] md:py-20">
        <div className="container">
          <div className="flex items-center justify-between gap-y-8 max-sm:flex-col">
            <Image
              priority={false}
              src={'/images/other/404-img.png'}
              width={2000}
              height={2000}
              alt="bg-img"
              className="w-3/4 sm:w-1/2"
            />
            <div className="text-content flex w-full items-center justify-center sm:w-1/2 sm:pl-10">
              <div className="">
                <div className="text-[42px] font-semibold leading-[52px] md:text-[80px] md:leading-[92px] lg:text-[140px] lg:leading-[152px]">
                  404
                </div>
                <div className="heading2 mt-4">Something is Missing.</div>
                <div className="body1 mt-4 pb-4 text-secondary">
                  The page you are looking for cannot be found.{' '}
                  <br className="max-xl:hidden" />
                  Take a break before trying again{' '}
                </div>
                <Link className="flex items-center gap-3" href={'/'}>
                  <Icon.ArrowLeft />
                  <div className="text-button">Back To Home</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PageNotFound;
