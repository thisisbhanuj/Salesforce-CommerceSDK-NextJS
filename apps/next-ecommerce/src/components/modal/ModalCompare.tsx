'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import * as Icon from '@phosphor-icons/react/dist/ssr';
import { useModalCompareContext } from '@/context/ModalCompareContext';
import { useCompare } from '@/context/CompareContext';
import InteractiveDiv from '../ui/interactiveDiv';

const ModalCompare = () => {
  const { isModalOpen, closeModalCompare } = useModalCompareContext();
  const { compareState, removeFromCompare } = useCompare();

  return (
    <div className={`modal-compare-block`}>
      <InteractiveDiv
        className={`modal-compare-main py-6 ${isModalOpen ? 'open' : ''}`}
        onClickHandler={(e) => {
          e.stopPropagation();
        }}
      >
        <InteractiveDiv
          className="close-btn absolute right-4 top-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-surface duration-300 hover:bg-black hover:text-white md:-top-4 lg:h-10 lg:w-10 2xl:right-6 2xl:top-6"
          onClickHandler={closeModalCompare}
        >
          <Icon.X className="body1" />
        </InteractiveDiv>
        <div className="container flex h-full w-full items-center">
          <div className="content-main flex w-full items-center justify-between gap-6 max-md:flex-wrap xl:gap-10">
            <div className="heading5 flex-shrink-0 max-md:w-full">
              Compare <br className="max-md:hidden" />
              Products
            </div>
            <div className="list-product flex w-full items-center gap-4">
              {compareState.compareArray.slice(0, 3).map((product) => (
                <div
                  key={product.id}
                  className="item relative rounded-xl border border-line p-3"
                >
                  <div className="infor flex items-center gap-4">
                    <div className="bg-img h-[100px] w-[100px] flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        priority={false}
                        src={product.images[0]}
                        width={500}
                        height={500}
                        alt={product.name}
                        className="h-full w-full"
                      />
                    </div>
                    <div>
                      <div className="name text-title">{product.name}</div>
                      <div className="product-price text-title mt-2">
                        ${product.price.listPrice}
                      </div>
                    </div>
                  </div>
                  <InteractiveDiv
                    className="close-btn absolute -right-4 -top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red text-white duration-300 hover:bg-black"
                    onClickHandler={() => removeFromCompare(product.id)}
                  >
                    <Icon.X size={14} />
                  </InteractiveDiv>
                </div>
              ))}
            </div>
            <div className="block-button flex flex-shrink-0 flex-col gap-4">
              {compareState.compareArray.length < 2 ? (
                <a
                  href="#!"
                  className="button-main whitespace-nowrap"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Icon.Plus size={14} />
                    <span>
                      {compareState.compareArray.length === 0
                        ? 'Add 2 Products'
                        : 'Add 1 More'}
                    </span>
                  </div>
                </a>
              ) : (
                <Link
                  href={'/compare'}
                  onClick={closeModalCompare}
                  className="button-main whitespace-nowrap"
                >
                  Compare Products
                </Link>
              )}
              <InteractiveDiv
                onClickHandler={() => {
                  closeModalCompare();
                  compareState.compareArray.length = 0;
                }}
                className="button-main whitespace-nowrap border border-black bg-white text-black"
              >
                Clear All Products
              </InteractiveDiv>
            </div>
          </div>
        </div>
      </InteractiveDiv>
    </div>
  );
};

export default ModalCompare;
