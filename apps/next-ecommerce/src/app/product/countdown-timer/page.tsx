'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import TopNavigationComponent from '@/components/header/TopNavigationComponent';
import Menu from '@/components/header/menu/Menu';
import BreadcrumbProduct from '@/components/breadcrumb/BreadcrumbProduct';
import CountdownTimer from '@/components/product/Detail/CountdownTimer';
import Footer from '@/components/footer/Footer';

const ProductCountdownTimer = () => {
  const searchParams = useSearchParams();
  let productId = searchParams.get('id');

  if (productId === null) {
    productId = '1';
  }

  return (
    <>
      <TopNavigationComponent
        props="bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <Menu props="bg-white" navigation={[]} session={null} />
        {/* <BreadcrumbProduct data={productData} productPage='countdown-timer' productId={productId} /> */}
      </div>
      {/* <CountdownTimer data={productData} productId={productId} /> */}
      <Footer />
    </>
  );
};

export default ProductCountdownTimer;
