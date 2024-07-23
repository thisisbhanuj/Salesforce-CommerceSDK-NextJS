import React from 'react';

import OrdersList from '@/components/standalone/OrdersList';
import Header from '@/components/header/Header';

const AccountOrders = () => {
  return (
    <>
      <Header heading="Profile" navModel={[]} subHeading="Orders" />
      <OrdersList />
    </>
  );
};

export default AccountOrders;
