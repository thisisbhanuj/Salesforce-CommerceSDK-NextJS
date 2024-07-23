'use client';

import React from 'react';

import AfterPurchaseContent from './AfterPurchaseContent';
import AdditionalInfo from './AdditionalInfo';
import QuantitySelector from './QuantitySelector';
import MainInformation from './MainInformation';
import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';

export default function PurchaseView() {
  return (
    <section className="product-infor w-full md:w-1/2 md:pl-2 lg:pl-[15px]">
      <div className="list-action">
        <MainInformation />
        <ColorSelector />
        <SizeSelector />
        <QuantitySelector />
        <AdditionalInfo />
        <AfterPurchaseContent />
      </div>
    </section>
  );
}
