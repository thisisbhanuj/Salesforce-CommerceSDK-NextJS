'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import * as Icon from '@phosphor-icons/react/dist/ssr';
import toast, { Toaster } from 'react-hot-toast';

import { ProductType } from '../../../types/ProductType';
import { useWishlist } from '@/context/WishlistContext';
import { useModalWishlistContext } from '@/context/ModalWishlistContext';
import { updateWishlistAction } from '@/actions/user.actions';
import { useCompare } from '@/context/CompareContext';
import { useModalCompareContext } from '@/context/ModalCompareContext';
import { useModalQuickviewContext } from '@/context/ModalQuickviewContext';
import { useRouter } from 'next/navigation';

import InteractiveDiv from '../ui/interactiveDiv';

interface ProductProps {
  data: ProductType;
  type: string;
}

const Product: React.FC<ProductProps> = ({ data, type }) => {
  const [activeColor, setActiveColor] = useState<string>('');
  const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist();
  const { openModalWishlist } = useModalWishlistContext();
  const { addToCompare, removeFromCompare, compareState } = useCompare();
  const { openModalCompare } = useModalCompareContext();
  const { openQuickview } = useModalQuickviewContext();
  const router = useRouter();

  const handleActiveColor = (item: string) => {
    setActiveColor(item);
  };

  const handleAddToWishlist = () => {
    const wishlistIDs = wishlistState.wishlistArray.map((item) => item.id);
    // if product existed in wishlit, remove from wishlist and set state to false
    if (wishlistState.wishlistArray.some((item) => item.skuId === data.skuId)) {
      removeFromWishlist(data.skuId);
      wishlistIDs.splice(wishlistIDs.indexOf(data.skuId), 1);
    } else {
      // else, add to wishlist and set state to true
      addToWishlist(data);
      wishlistIDs.push(data.skuId);
      openModalWishlist();
    }
    updateWishlistAction(wishlistIDs);
  };

  const handleAddToCompare = () => {
    // if product existed in wishlit, remove from wishlist and set state to false
    if (compareState.compareArray.length < 3) {
      if (compareState.compareArray.some((item) => item.skuId === data.skuId)) {
        removeFromCompare(data.skuId);
      } else {
        // else, add to wishlist and set state to true
        addToCompare(data);
      }
    } else {
      toast.error('Compare up to 3 products');
    }

    openModalCompare();
  };

  const handleQuickviewOpen = () => {
    openQuickview(data);
  };

  const handleProductDisplay = (skuId: string) => {
    router.push(`/product/${skuId}`);
  };

  let percentSale = data.sale
    ? Math.floor(100 - (data.price.salesPrice / data.price.listPrice) * 100)
    : 0;
  let percentSold = Math.floor((data.sold / data.quantity) * 100);

  return (
    <>
      <div className="product-item grid-type">
        <InteractiveDiv
          onClickHandler={() => handleProductDisplay(data.skuId)}
          className="product-main block cursor-pointer"
        >
          <div className="product-thumb relative overflow-hidden rounded-2xl bg-white">
            {data.new && (
              <div className="product-tag text-button-uppercase absolute left-3 top-3 z-[1] inline-block rounded-full bg-green px-3 py-0.5">
                New
              </div>
            )}
            {data.sale && (
              <div className="product-tag text-button-uppercase absolute left-3 top-3 z-[1] inline-block rounded-full bg-red px-3 py-0.5 text-white">
                Sale
              </div>
            )}
            <div className="list-action-right absolute right-3 top-3 max-lg:hidden">
              <button
                className={`add-wishlist-btn relative flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white duration-300 ${wishlistState.wishlistArray.some((item) => item.skuId === data.skuId) ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToWishlist();
                }}
              >
                <div className="tag-action caption2 rounded-sm bg-black px-1.5 py-0.5 text-white">
                  Add To Wishlist
                </div>
                {wishlistState.wishlistArray.some(
                  (item) => item.skuId === data.skuId,
                ) ? (
                  <Icon.Heart size={18} weight="fill" className="text-white" />
                ) : (
                  <Icon.Heart size={18} />
                )}
              </button>
              <button
                className={`compare-btn relative mt-2 flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white duration-300 ${compareState.compareArray.some((item) => item.skuId === data.skuId) ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCompare();
                }}
              >
                <div className="tag-action caption2 rounded-sm bg-black px-1.5 py-0.5 text-white">
                  Compare Product
                </div>
                <Icon.ArrowsCounterClockwise
                  size={18}
                  className="compare-icon"
                />
                <Icon.CheckCircle size={20} className="checked-icon" />
              </button>
            </div>
            <div className="product-img aspect-[3/4] h-full w-full">
              {activeColor ? (
                <>
                  {
                    <Image
                      priority={false}
                      src={
                        data.variation.find(
                          (item) => item.color === activeColor,
                        )?.image ?? ''
                      }
                      width={500}
                      height={500}
                      alt={data.name}
                      className="h-full w-full object-cover duration-700"
                    />
                  }
                </>
              ) : (
                <>
                  {
                    <Image
                      priority={false}
                      key={1}
                      src={data.images[0]}
                      width={500}
                      height={500}
                      alt={data.name}
                      className="h-full w-full object-cover duration-700"
                    />
                  }
                </>
              )}
            </div>

            {/* **************************************************** */}
            {/* Remoevd because issue with Zustand PDP Provider impl */}

            {/* <div className="list-action grid grid-cols-1 gap-3 px-5 absolute w-full bottom-5 max-lg:hidden">
                        <button
                            className="quick-view-btn w-full text-button-uppercase py-2 
                                text-center rounded-full duration-300 bg-white hover:bg-black hover:text-white"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleQuickviewOpen()
                            }}
                        >
                            Quick View
                        </button>
                        
                    </div> */}
            {/* **************************************************** */}
          </div>
          <div className="product-infor mt-4 lg:mb-7">
            <div className="product-sold pb-2 sm:pb-4">
              <div className="progress relative h-1.5 w-full overflow-hidden rounded-full bg-line">
                <div
                  className={`progress-sold absolute left-0 top-0 h-full bg-red`}
                  style={{ width: `${percentSold}%` }}
                ></div>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3 gap-y-1">
                <div className="text-button-uppercase">
                  <span className="text-secondary2 max-sm:text-xs">Sold: </span>
                  <span className="max-sm:text-xs">{data.sold}</span>
                </div>
                <div className="text-button-uppercase">
                  <span className="text-secondary2 max-sm:text-xs">
                    Available:{' '}
                  </span>
                  <span className="max-sm:text-xs">
                    {data.quantity - data.sold}
                  </span>
                </div>
              </div>
            </div>

            <div className="product-name text-title duration-300">
              {data.name}
            </div>

            <div className="list-color flex flex-wrap items-center gap-3 py-2 duration-500 max-md:hidden">
              {data?.variation?.map((item, index) => (
                <button
                  key={item.color}
                  className={`color-item relative h-8 w-8 rounded-full duration-300 ${activeColor === item.color ? 'active' : ''}`}
                  style={{ backgroundColor: `${item.colorCode}` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActiveColor(item.color);
                  }}
                >
                  <div className="tag-action caption2 rounded-sm bg-black px-1.5 py-0.5 capitalize text-white">
                    {item.color}
                  </div>
                </button>
              ))}
            </div>

            <div className="product-price-block relative z-[1] mt-1 flex flex-wrap items-center gap-2 duration-300">
              {percentSale > 0 ? (
                <>
                  <div className="product-origin-price caption1 text-secondary2">
                    ${data.price.salesPrice}
                  </div>
                  <div className="product-origin-price caption1 text-secondary2">
                    <del>${data.price.listPrice}</del>
                  </div>
                  <div className="product-sale caption1 inline-block rounded-full bg-green px-3 py-0.5 font-medium">
                    -{percentSale}%
                  </div>
                </>
              ) : (
                <div className="product-price text-title">
                  ${data.price.listPrice}
                </div>
              )}
            </div>
          </div>
        </InteractiveDiv>
      </div>
      <Toaster
        key={'product-toast'}
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
    </>
  );
};

export default Product;
