import React from 'react';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Account from '@/components/profile/account/Account';
import { existingOrNewCart } from '@/actions/cart.actions';

type CartContent = {
  success: boolean;
  message: string;
  userCartModel: string;
};

const MyAccount = async () => {
  const response = await existingOrNewCart();
  return (
    <>
      <Header heading="Profile" subHeading="" navModel={[]} />
      <Account cartContent={response as CartContent} />
      <Footer />
    </>
  );
};

export default MyAccount;
