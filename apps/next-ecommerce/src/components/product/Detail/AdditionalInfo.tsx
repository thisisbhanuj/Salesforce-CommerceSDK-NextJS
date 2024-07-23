import React from 'react';
import * as Icon from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import DeliveryDateCalculator from '@/components/standalone/DeliveryDateCalculator';

import { usePDPStore } from '@/zustand/context/usePDPStore';

interface Props {}
const AdditionalInfo: React.FC<Props> = () => {
  const [productMain] = usePDPStore((state) => [state.productMain]);

  return (
    <div className="more-infor mt-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1">
          <Icon.ArrowClockwise className="body1" />
          <Link href="/" className="text-title">
            Delivery & Return
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <Icon.Question className="body1" />
          <Link href="/" className="text-title">
            Ask A Question
          </Link>
        </div>
      </div>

      <DeliveryDateCalculator />

      {/* <div className="flex items-center gap-1 mt-3">
                <Icon.Eye className='body1' />
                <div className="text-title">38</div>
                <div className="text-secondary">people viewing this product right now!</div>
            </div> */}
      <div className="mt-3 flex items-center gap-1">
        <div className="text-title">SKU:</div>
        <div className="text-secondary">{productMain?.skuId}</div>
      </div>
      <div className="mt-3 flex items-center gap-1">
        <div className="text-title">Categories:</div>
        <div className="text-secondary">
          {productMain?.category}, {productMain?.gender}
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;
