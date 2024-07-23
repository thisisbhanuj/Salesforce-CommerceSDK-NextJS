import React from 'react';
import * as Icon from '@phosphor-icons/react/dist/ssr';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import Rate from '@/components/standalone/Rate';
import { ProductType } from '../../../../types/ProductType';
import { useModalWishlistContext } from '@/context/ModalWishlistContext';
import { useWishlist } from '@/context/WishlistContext';
import { updateWishlistAction } from '@/actions/user.actions';

import { usePDPStore } from '@/zustand/context/usePDPStore';

interface Props {
  product?: ProductType | undefined;
}
const MainInformation: React.FC<Props> = ({}) => {
  const [productMain] = usePDPStore((state) => [state.productMain]);

  const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist();
  const { openModalWishlist } = useModalWishlistContext();

  const percentSale = productMain?.sale
    ? Math.floor(
        100 -
          (productMain.price.salesPrice / productMain.price.listPrice) * 100,
      )
    : 0;

  const handleAddToWishlist = () => {
    // if productMain existed in wishlit, remove from wishlist and set state to false
    if (productMain) {
      const wishlistIDs = wishlistState.wishlistArray.map((item) => item.id);
      // if productMain existed in wishlit, remove from wishlist and set state to false
      if (
        wishlistState.wishlistArray.some(
          (item) => item.skuId === productMain.skuId,
        )
      ) {
        removeFromWishlist(productMain.skuId);
        wishlistIDs.splice(wishlistIDs.indexOf(productMain.skuId), 1);
      } else {
        // else, add to wishlist and set state to true
        addToWishlist(productMain);
        wishlistIDs.push(productMain.skuId);
        openModalWishlist();
      }
      updateWishlistAction(wishlistIDs);
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <div>
          <div className="caption2 font-semibold uppercase text-secondary">
            {productMain?.productType ?? (
              <Skeleton count={1} height={30} width={100} />
            )}
          </div>
          <div className="heading4 mt-1">{productMain?.name}</div>
        </div>
        <button
          className={`add-wishlist-btn flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border border-line duration-300 hover:bg-black hover:text-white ${wishlistState.wishlistArray.some((item) => item.id === productMain?.id) ? 'active' : ''}`}
          onClick={handleAddToWishlist}
        >
          {wishlistState.wishlistArray.some(
            (item) => item.id === productMain?.id,
          ) ? (
            <Icon.Heart size={24} weight="fill" className="text-white" />
          ) : (
            <Icon.Heart size={24} />
          )}
        </button>
      </div>
      <div className="mt-3 flex items-center">
        <Rate currentRate={productMain?.rating} size={14} />
        <span className="caption1 text-secondary">
          {productMain?.numReviews ?? (
            <Skeleton count={1} height={30} width={100} />
          )}
        </span>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 pb-6">
        {percentSale > 0 ? (
          <>
            <div className="product-price heading5">
              ${productMain?.price.salesPrice}
            </div>
            <div className="h-4 w-px bg-line"></div>
            <div className="product-origin-price font-normal text-secondary2">
              <del>${productMain?.price?.listPrice}</del>
            </div>
            <div className="product-sale caption2 inline-block rounded-full bg-green px-3 py-0.5 font-semibold">
              -{percentSale}%
            </div>
          </>
        ) : (
          <div className="product-price heading5">
            $
            {productMain?.price?.listPrice ?? (
              <Skeleton count={1} height={30} width={200} />
            )}
          </div>
        )}
      </div>
      <div className="desc mt-3 text-secondary">
        {productMain?.description ?? (
          <Skeleton count={3} height={10} width={500} />
        )}
      </div>
      <div className="mt-3 border-b border-line"></div>
    </>
  );
};

export default MainInformation;
