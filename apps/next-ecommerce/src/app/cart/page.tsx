import React from 'react';

import CartContainer from '@/components/cart/CartContainer';
import { existingOrNewCart } from '@/actions/cart.actions';
import Header from '@/components/header/Header';

type CartContent = {
  success: boolean;
  message: string;
  userCartModel: string;
};

export default async function Cart() {
  const response = await existingOrNewCart();
  return (
    <>
      <Header heading="Shopping Cart" subHeading="Cart" navModel={[]} />
      <CartContainer cartContent={response as CartContent} />
    </>
  );
}
