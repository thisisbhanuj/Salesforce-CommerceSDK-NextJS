'use client';
import React from 'react';
import Link from 'next/link';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';

const OrderTracking = () => {
  return (
    <>
      <div className="order-tracking py-10 md:py-20">
        <div className="container">
          <div className="content-main flex gap-y-8 max-md:flex-col">
            <div className="left w-full border-line md:w-1/2 md:border-r md:pr-[40px] lg:pr-[60px]">
              <div className="heading4">Order Tracking</div>
              <div className="mt-2">
                To track your order please enter your Order ID in the box below
                and press the {String.raw`"`}Track{String.raw`"`} button. This
                was given to you on your receipt and in the confirmation email
                you should have received.
              </div>
              <form className="mt-4 md:mt-7">
                <div className="email">
                  <input
                    className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                    id="username"
                    type="email"
                    placeholder="Username or email address *"
                    required
                  />
                </div>
                <div className="billing mt-5">
                  <input
                    className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                    id="billing"
                    type="email"
                    placeholder="Billing Email *"
                    required
                  />
                </div>
                <div className="block-button mt-4 md:mt-7">
                  <button className="button-main">Tracking Orders</button>
                </div>
              </form>
            </div>
            <div className="right flex w-full items-center md:w-1/2 md:pl-[40px] lg:pl-[60px]">
              <div className="text-content">
                <div className="heading4">Already have an account?</div>
                <div className="mt-2 text-secondary">
                  Welcome back. Sign in to access your personalized experience,
                  saved preferences, and more. We{String.raw`'re`} thrilled to
                  have you with us again!
                </div>
                <div className="block-button mt-4 md:mt-7">
                  <Link href={'/login'} className="button-main">
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderTracking;
