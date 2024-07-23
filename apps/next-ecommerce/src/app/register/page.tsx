'use server';

import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import AccountRegistration from '@/components/profile/account/Register';

const Register = () => {
  return (
    <>
      <Header heading="Register" navModel={[]} subHeading="" />
      <AccountRegistration />
      <Footer />
    </>
  );
};

export default Register;
