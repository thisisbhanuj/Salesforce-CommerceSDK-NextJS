import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { usePDPStore } from '@/zustand/context/usePDPStore';

interface Props {}

const ColorSelector: React.FC<Props> = ({}) => {
  const [productMain, handleActiveColor, activeColor] = usePDPStore((state) => [
    state.productMain,
    state.handleActiveColor,
    state.activeColor,
  ]);

  return (
    <div className="choose-color mt-6">
      <div className="text-title">
        Colors: <span className="text-title color">{activeColor}</span>
      </div>
      <div className="list-color mt-3 flex flex-wrap items-center gap-2">
        {productMain?.variation?.map((item, index) => (
          <button
            className={`color-item relative h-8 w-8 rounded-full duration-300 ${activeColor === item.color ? 'active' : ''}`}
            key={activeColor + '_' + index}
            style={{ backgroundColor: `${item.colorCode}` }}
            datatype={item.image}
            onClick={() => {
              handleActiveColor(item.color);
            }}
          >
            <div className="tag-action caption2 rounded-sm bg-black px-1.5 py-0.5 capitalize text-white">
              {item.color}
            </div>
          </button>
        )) ?? <Skeleton count={1} height={30} width={100} />}
      </div>
    </div>
  );
};

export default ColorSelector;
