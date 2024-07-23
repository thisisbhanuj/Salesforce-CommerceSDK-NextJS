'use client';

import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { createPaymentIntent } from '@/actions/payment.actions';
import StripePaymentForm from './StripePaymentForm';

type StripeAppProps = {
  orderTotal: number | undefined;
  currency: string;
  orderSubmitHandler: (paymentIntentId: string) => void;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? '',
);

const StripeApp = ({
  orderTotal,
  currency,
  orderSubmitHandler,
}: StripeAppProps) => {
  const [clientSecret, setClientSecret] = useState('');
  const [options, setOptions] = useState({});

  const fetchClientSecret = async () => {
    if (!orderTotal || orderTotal <= 0) {
      toast.error('Invalid Order Amount, Please try again!');
    } else {
      const stripeResponse = await createPaymentIntent(orderTotal, currency);
      if (stripeResponse?.success) {
        setClientSecret(stripeResponse.clientSecret);
        setOptions({
          mode: 'payment',
          currency: stripeResponse.currency,
          amount: stripeResponse.amount * 100,
        });
      }
    }
  };

  useEffect(() => {
    fetchClientSecret();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          className: '',
          duration: 3000,
          style: {
            background: '#363636',
            color: '#ffff',
          },
          success: {
            style: {},
          },
          error: {
            style: {},
          },
        }}
      />
      {clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <StripePaymentForm
            clientSecret={clientSecret}
            orderSubmitHandler={orderSubmitHandler}
          />
        </Elements>
      ) : (
        <>
          <Skeleton count={1} height={50} width={400} />
          <Skeleton count={4} height={30} width={400} />
        </>
      )}
    </>
  );
};

export default StripeApp;
