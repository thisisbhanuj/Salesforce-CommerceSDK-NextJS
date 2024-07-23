'use client';

import React from 'react';

import StripeApp from '../../payments/stripe/StripeApp';
import { CartType } from '@/CartType';

type PaymentProps = {
  cartModel: CartType | undefined;
  orderSubmitHandler: (paymentIntentId: string) => void;
};

const PaymentForm: React.FC<PaymentProps> = ({
  cartModel,
  orderSubmitHandler,
}) => {
  return (
    <>
      <div className="information pt-1">
        <h2 className="heading5 mb-4">Payment</h2>
      </div>
      <StripeApp
        currency={'usd'}
        orderTotal={cartModel?.finalOrderAmount}
        orderSubmitHandler={orderSubmitHandler}
      />
    </>
  );
};

export default PaymentForm;
