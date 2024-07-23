'use client';

import React from 'react';
import Image from 'next/image';
import * as Icon from '@phosphor-icons/react/dist/ssr';
import toast, { Toaster } from 'react-hot-toast';

import { useModalQuickviewContext } from '@/context/ModalQuickviewContext';
import { useCompare } from '@/context/CompareContext';
import { useModalCompareContext } from '@/context/ModalCompareContext';
import InteractiveDiv from '../ui/interactiveDiv';

import QuantitySelector from '../product/Detail/QuantitySelector';
import SizeSelector from '../product/Detail/SizeSelector';
import ColorSelector from '../product/Detail/ColorSelector';
import MainInformation from '../product/Detail/MainInformation';
import AdditionalInfo from '../product/Detail/AdditionalInfo';

const ModalQuickview = () => {
  const { selectedProduct, closeQuickview } = useModalQuickviewContext();

  const { addToCompare, removeFromCompare, compareState } = useCompare();
  const { openModalCompare } = useModalCompareContext();

  const handleAddToCompare = () => {
    // if product existed in wishlit, remove from wishlist and set state to false
    if (selectedProduct) {
      // if product existed in wishlit, remove from wishlist and set state to false
      if (compareState.compareArray.length < 3) {
        if (
          compareState.compareArray.some(
            (item) => item.skuId === selectedProduct.skuId,
          )
        ) {
          removeFromCompare(selectedProduct.skuId);
        } else {
          // else, add to wishlist and set state to true
          addToCompare(selectedProduct);
        }
      } else {
        toast.error('Compare up to 3 products');
      }

      openModalCompare();
    }
  };

  return (
    <InteractiveDiv
      className={`modal-quickview-block`}
      onClickHandler={closeQuickview}
    >
      <InteractiveDiv
        className={`modal-quickview-main py-6 ${selectedProduct !== null ? 'open' : ''}`}
        onClickHandler={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex h-full gap-y-6 max-md:flex-col-reverse">
          <div className="left flex-shrink-0 px-6 md:w-[300px] lg:w-[388px]">
            <div className="list-img items-center gap-4 max-md:flex">
              {selectedProduct?.images.map((item, index) => (
                <div
                  className="bg-img aspect-[3/4] w-full overflow-hidden rounded-[20px] max-md:w-[150px] max-md:flex-shrink-0 md:mt-6"
                  key={index}
                >
                  <Image
                    priority={false}
                    src={item}
                    width={1500}
                    height={2000}
                    alt={item}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="right w-full px-6">
            <div className="heading relative flex items-center justify-between pb-6">
              <div className="heading5">Quick View</div>
              <button
                className="close-btn absolute right-0 top-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-surface duration-300 hover:bg-black hover:text-white"
                onClick={closeQuickview}
              >
                <Icon.X size={14} />
              </button>
            </div>
            {!!selectedProduct && (
              <div className="product-infor">
                <MainInformation />
                <div className="list-action mt-6">
                  <ColorSelector />
                  <SizeSelector />
                  <QuantitySelector />
                  {
                    <div className="mt-5 flex flex-wrap items-center gap-8 gap-y-4 lg:gap-20">
                      <InteractiveDiv
                        className="compare flex cursor-pointer items-center gap-3"
                        onClickHandler={handleAddToCompare}
                      >
                        <div className="compare-btn flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-line duration-300 hover:bg-black hover:text-white md:h-12 md:w-12">
                          <Icon.ArrowsCounterClockwise className="heading6" />
                        </div>
                        <span>Compare</span>
                      </InteractiveDiv>
                    </div>
                  }
                  <AdditionalInfo />
                </div>
              </div>
            )}
          </div>
        </div>
      </InteractiveDiv>
      <Toaster
        position="top-center"
        toastOptions={{
          className: '',
          duration: 3000,
          style: {
            background: '#363636',
            color: '#ffff',
          },
          success: {
            style: {},
          },
          error: {
            style: {},
          },
        }}
      />
    </InteractiveDiv>
  );
};

export default ModalQuickview;
