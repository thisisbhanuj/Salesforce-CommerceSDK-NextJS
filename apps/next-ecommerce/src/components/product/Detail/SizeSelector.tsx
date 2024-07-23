import React, { useState } from 'react';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import ModalSizeguide from '@/components/modal/ModalSizeguide';

import { usePDPStore } from '@/zustand/context/usePDPStore';

interface Props {}

const SizeSelector: React.FC<Props> = ({}) => {
  const [productMain, handleActiveSize, activeSize] = usePDPStore((state) => [
    state.productMain,
    state.handleActiveSize,
    state.activeSize,
  ]);

  const [openSizeGuide, setOpenSizeGuide] = useState<boolean>(false);

  const handleOpenSizeGuide = () => {
    setOpenSizeGuide(true);
  };

  const handleCloseSizeGuide = () => {
    setOpenSizeGuide(false);
  };

  return (
    <div className="choose-size mt-5">
      <div className="heading flex items-center justify-between">
        <div className="text-title">
          Size: <span className="text-title size">{activeSize}</span>
        </div>
        <button
          className="caption1 size-guide cursor-pointer text-red underline"
          onClick={handleOpenSizeGuide}
        >
          Size Guide
        </button>
        <ModalSizeguide
          data={productMain}
          isOpen={openSizeGuide}
          onClose={handleCloseSizeGuide}
        />
      </div>
      <div className="list-size mt-3 flex flex-wrap items-center gap-2">
        {productMain?.sizes.map((item, index) => (
          <button
            className={`size-item ${item === 'freesize' ? 'px-3 py-2' : 'h-12 w-12'} text-button flex items-center justify-center rounded-full border border-line bg-white ${activeSize === item ? 'active' : ''}`}
            key={item + '_' + index}
            onClick={() => handleActiveSize(item)}
          >
            {item}
          </button>
        )) ?? <Skeleton count={1} height={30} width={100} />}
      </div>
    </div>
  );
};

export default SizeSelector;
