import React from 'react';

import PasswordReset from '@/components/profile/PasswordReset';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';

const Reset = () => {
  return (
    <>
      <Header heading="Reset Password" subHeading="" navModel={[]} />
      <PasswordReset />
      <Footer />
    </>
  );
};

export default Reset;
