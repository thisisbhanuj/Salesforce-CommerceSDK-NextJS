'use server';

import React from 'react';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import ForgotPassword from '@/components/profile/ForgotPassword';

const Reset = async () => {
  return (
    <>
      <Header heading="Forgot Password" subHeading="" navModel={[]} />
      <ForgotPassword />
      <Footer />
    </>
  );
};

export default Reset;
