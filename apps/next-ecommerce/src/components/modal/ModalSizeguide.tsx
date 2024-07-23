'use client';

import React, { useState } from 'react';
import * as Icon from '@phosphor-icons/react/dist/ssr';
import { ProductType } from '../../../types/ProductType';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface Props {
  data: ProductType | undefined | null;
  isOpen: boolean;
  onClose: () => void;
}

const ModalSizeguide: React.FC<Props> = ({ data, isOpen, onClose }) => {
  const [activeSize, setActiveSize] = useState<string>('');
  const [heightRange, setHeightRange] = useState<{ min: number; max: number }>({
    min: 100,
    max: 200,
  });
  const [weightRange, setWeightRange] = useState<{ min: number; max: number }>({
    min: 30,
    max: 90,
  });

  const calculateSize = (height: number, weight: number) => {
    if (height > 180 || weight > 70) {
      setActiveSize('2XL');
    } else if (height > 170 || weight > 60) {
      setActiveSize('XL');
    } else if (height > 160 || weight > 50) {
      setActiveSize('L');
    } else if (height > 155 || weight > 45) {
      setActiveSize('M');
    } else if (height > 150 || weight > 40) {
      setActiveSize('S');
    } else {
      setActiveSize('XS');
    }
  };

  const handleHeightChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      setHeightRange({ min: values[0], max: values[1] });
    }
    calculateSize(heightRange.max, weightRange.max);
  };

  const handleWeightChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      setWeightRange({ min: values[0], max: values[1] });
    }
    calculateSize(heightRange.max, weightRange.max);
  };

  return (
    <div className={`modal-sizeguide-block`} onClick={onClose}>
      <div
        className={`modal-sizeguide-main rounded-[32px] p-6 md:p-10 ${isOpen ? 'open' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className="close-btn absolute right-5 top-5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-surface duration-300 hover:bg-black hover:text-white"
          onClick={onClose}
        >
          <Icon.X size={14} />
        </div>
        <div className="heading3">Size guide</div>
        <div className="progress mt-6 md:mt-8">
          <div className="imd:items-center flex justify-between gap-10 gap-y-5 max-md:flex-col max-md:pr-3">
            <div className="flex flex-shrink-0 items-center gap-8">
              <span className="flex-shrink-0 md:w-14">Height</span>
              <div className="flex w-20 flex-shrink-0 items-center justify-center gap-1 rounded-lg border border-line py-2">
                <span>{heightRange.max}</span>
                <span className="caption1 text-secondary">Cm</span>
              </div>
            </div>
            <Slider
              range
              defaultValue={[100, 200]}
              min={100}
              max={200}
              onChange={handleHeightChange}
            />
          </div>
          <div className="mt-5 flex justify-between gap-10 gap-y-5 max-md:flex-col max-md:pr-3 md:items-center">
            <div className="flex flex-shrink-0 items-center gap-8">
              <span className="flex-shrink-0 md:w-14">Weight</span>
              <div className="flex w-20 flex-shrink-0 items-center justify-center gap-1 rounded-lg border border-line py-2">
                <span>{weightRange.max}</span>
                <span className="caption1 text-secondary">Kg</span>
              </div>
            </div>
            <Slider
              range
              defaultValue={[30, 90]}
              min={30}
              max={90}
              onChange={handleWeightChange}
            />
          </div>
        </div>
        <div className="heading6 mt-8">suggests for you:</div>
        <div className="list-size mt-3 flex flex-wrap items-center gap-2">
          {data?.sizes?.map((item, index) => (
            <div
              className={`size-item text-button flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white ${activeSize === item ? 'active' : ''}`}
              key={index}
              // onClick={() => handleActiveSize(item)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalSizeguide;
