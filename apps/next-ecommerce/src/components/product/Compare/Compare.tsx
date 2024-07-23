'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

import debouncer from '@/utility/debouncer';
import Footer from '@/components/footer/Footer';
import { useCompare } from '@/context/CompareContext';
import { useWishlist } from '@/context/WishlistContext';
import { useModalWishlistContext } from '@/context/ModalWishlistContext';
import { updateWishlistAction } from '@/actions/user.actions';
import { ProductType } from '@/ProductType';
import Rate from '@/components/standalone/Rate';
import InteractiveDiv from '@/components/ui/interactiveDiv';

const CompareProductComponent = () => {
  const { compareState } = useCompare();
  const { addToWishlist, wishlistState } = useWishlist();
  const { openModalWishlist } = useModalWishlistContext();
  const router = useRouter();

  const handleProductDisplay = (skuId: string) => {
    router.push(`/product/${skuId}`);
  };

  const handleAddToWishlist = (product: ProductType) => {
    const wishlistIDs = wishlistState.wishlistArray.map((item) => item.id);
    // if product existed in wishlit, do nothing
    if (
      wishlistState.wishlistArray.some((item) => item.skuId === product.skuId)
    ) {
      toast.error('Product already in wishlist!');
    } else {
      // else, add to wishlist and set state to true
      addToWishlist(product);
      wishlistIDs.push(product.skuId);
      openModalWishlist();
      updateWishlistAction(wishlistIDs);
    }
  };

  const handleSelection = debouncer(handleProductDisplay, 1000);
  const handleAddWishlist = debouncer(handleAddToWishlist, 1000);

  return (
    <>
      <div className="compare-block py-10 md:py-20">
        <div className="container">
          <div className="content-main">
            <div>
              <div className="list-product flex">
                <div className="left w-[170px] flex-shrink-0 lg:w-[240px]"></div>
                <div className="right flex w-full rounded-t-2xl border border-b-0 border-line">
                  {compareState.compareArray.map((item) => (
                    <InteractiveDiv
                      key={item.id}
                      onClickHandler={() => handleSelection(item.id)}
                      className="product-item block cursor-pointer border-r border-line px-10 pb-5 pt-6"
                    >
                      <div className="compare-image bg-img aspect-[3/4] w-full flex-shrink-0 overflow-hidden rounded-lg">
                        <Image
                          priority={false}
                          src={item.images[0]}
                          width={1000}
                          height={1500}
                          alt={item.images[0]}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="text-title mt-4 text-center">
                        {item.name}
                      </div>
                    </InteractiveDiv>
                  ))}
                </div>
              </div>
              <div className="compare-table flex">
                <div className="left w-[170px] flex-shrink-0 rounded-l-2xl border border-r-0 border-line lg:w-[240px]">
                  <div className="item text-button flex h-[60px] w-full items-center border-b border-line px-8">
                    Rating
                  </div>
                  <div className="item text-button flex h-[60px] w-full items-center border-b border-line px-8">
                    Price
                  </div>
                  <div className="item text-button flex h-[60px] w-full items-center border-b border-line px-8">
                    Size
                  </div>
                  <div className="item text-button flex h-[60px] w-full items-center border-b border-line px-8">
                    Colors
                  </div>
                  <div className="item text-button flex h-[60px] w-full items-center border-b border-line px-8">
                    Material
                  </div>
                  <div className="item text-button flex h-[60px] w-full items-center border-b border-line px-8"></div>
                </div>
                <table className="right w-full border-collapse border-r border-t border-line">
                  <tr className={`flex w-full items-center`}>
                    {compareState.compareArray.map((item, index) => (
                      <td
                        className="h-[60px] w-full border border-r-0 border-t-0 border-line"
                        key={item.id}
                      >
                        <div className="flex h-full items-center justify-center">
                          <Rate currentRate={item.rating} size={12} />
                          <p className="pl-1">(1.234)</p>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className={`flex w-full items-center`}>
                    {compareState.compareArray.map((item, index) => (
                      <td
                        className="h-[60px] w-full border border-r-0 border-t-0 border-line"
                        key={item.id}
                      >
                        <div className="flex h-full items-center justify-center">
                          ${item.price.listPrice}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className={`flex w-full items-center`}>
                    {compareState.compareArray.map((item, index) => (
                      <td
                        className="size h-[60px] w-full border border-r-0 border-t-0 border-line"
                        key={item.id}
                      >
                        <div className="flex h-full items-center justify-center gap-1 capitalize">
                          {item.sizes.map((size, i) => (
                            <p key={i}>
                              {size}
                              <span>,</span>
                            </p>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className={`flex w-full items-center`}>
                    {compareState.compareArray.map((item, index) => (
                      <td
                        className="size h-[60px] w-full border border-r-0 border-t-0 border-line"
                        key={item.id}
                      >
                        <div className="flex h-full items-center justify-center gap-2 capitalize">
                          {item.variation.map((colorItem, i) => (
                            <span
                              key={i}
                              className={`h-6 w-6 rounded-full`}
                              style={{
                                backgroundColor: `${colorItem.colorCode}`,
                              }}
                            ></span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className={`flex w-full items-center`}>
                    {compareState.compareArray.map((item, index) => (
                      <td
                        className="h-[60px] w-full border border-r-0 border-t-0 border-line"
                        key={item.id}
                      >
                        <div className="flex h-full items-center justify-center capitalize">
                          {item.material}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className={`flex w-full items-center`}>
                    {compareState.compareArray.map((item, index) => (
                      <>
                        <td
                          className="h-[60px] w-1/2 border border-r-0 border-t-0 border-line"
                          key={item.id}
                        >
                          <div className="flex h-full items-center justify-center">
                            <div
                              className="button-main px-5 py-1.5"
                              onClick={() => handleSelection(item.id)}
                            >
                              Select Product
                            </div>
                          </div>
                        </td>
                        <td
                          className="h-[60px] w-1/2 border border-r-0 border-t-0 border-line"
                          key={item.id}
                        >
                          <div className="flex h-full items-center justify-center">
                            <div
                              className="button-main px-5 py-1.5"
                              onClick={() => handleAddWishlist(item)}
                            >
                              Add To Wishlist
                            </div>
                          </div>
                        </td>
                      </>
                    ))}
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Toaster
        position="bottom-center"
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

export default CompareProductComponent;
