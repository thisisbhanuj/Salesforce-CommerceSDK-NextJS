import React from 'react';

import Customization from '@/components/customization/Customization';
import Header from '@/components/header/Header';

const Questionaire = () => {
  return (
    <>
      <Header heading="Customization" subHeading="" navModel={[]} />
      <Customization />
    </>
  );
};

export default Questionaire;
