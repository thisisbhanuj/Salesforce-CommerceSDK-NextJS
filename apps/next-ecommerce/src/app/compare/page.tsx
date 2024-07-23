import React from 'react';

import CompareProductComponent from '@/components/product/Compare/Compare';
import Footer from '@/components/footer/Footer';
import TopNavigationComponent from '@/components/header/TopNavigationComponent';
import Menu from '@/components/header/menu/Menu';
import { getCurrentSession } from '@/lib/session';
import { cachedFetchNavigationCategories } from '@/cachefns/cachefns';
import { PrimaryCategory } from '@/Category';

const Compare = async () => {
  const session = await getCurrentSession();

  let navModel: PrimaryCategory[] = [];
  const navigation = await cachedFetchNavigationCategories();
  if (navigation?.categories) {
    navModel = navigation.categories;
  }

  return (
    <>
      <TopNavigationComponent
        props="bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <Menu props="bg-transparent" session={session} navigation={navModel} />
      </div>
      <CompareProductComponent />
      <Footer />
    </>
  );
};

export default Compare;
