'use server';

import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import CheckoutContainer from '@/components/checkout/CheckoutContainer';

const Checkout = () => {
  return (
    <>
      <Header heading="Checkout" subHeading={''} navModel={[]} />
      <CheckoutContainer />
      <Footer />
    </>
  );
};

export default Checkout;
