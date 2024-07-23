import React from 'react';
import { redirect, RedirectType } from 'next/navigation';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import LoginComponent from '@/components/profile/account/Login';
import { getCurrentUser } from '@/lib/session';

const Login = async () => {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect('/profile', RedirectType.replace);
  }

  return (
    <>
      <Header heading="Login" subHeading="" navModel={[]} />
      <LoginComponent />
      <Footer />
    </>
  );
};

export default Login;
