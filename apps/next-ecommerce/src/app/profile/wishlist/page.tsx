import React from 'react';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import WishList from '@/components/product/WishList/WishList';
import { fetchNavigationCategories } from '@/actions/browse.actions';
import { PrimaryCategory } from '@/Category';

const Wishlist = async () => {
  const navigation = await fetchNavigationCategories();
  let navModel: PrimaryCategory[] = [];
  if (navigation?.success) {
    navModel = JSON.parse(navigation.categories.toString());
  }

  return (
    <>
      <Header heading="Profile" navModel={navModel} subHeading="Wishlist" />
      <WishList />
      <Footer />
    </>
  );
};

export default Wishlist;
