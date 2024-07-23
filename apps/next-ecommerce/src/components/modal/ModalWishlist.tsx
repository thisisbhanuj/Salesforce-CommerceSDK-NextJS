'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as Icon from '@phosphor-icons/react/dist/ssr';

import { useModalWishlistContext } from '@/context/ModalWishlistContext';
import { useWishlist } from '@/context/WishlistContext';

const ModalWishlist = () => {
  const { isModalOpen, closeModalWishlist } = useModalWishlistContext();
  const { wishlistState, removeFromWishlist } = useWishlist();

  return (
    <div className={`modal-wishlist-block`} onClick={closeModalWishlist}>
      <div
        className={`modal-wishlist-main py-6 ${isModalOpen ? 'open' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="heading relative flex items-center justify-between px-6 pb-3">
          <div className="heading5">Wishlist</div>
          <button
            className="close-btn absolute right-6 top-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-surface duration-300 hover:bg-black hover:text-white"
            onClick={closeModalWishlist}
          >
            <Icon.X size={14} />
          </button>
        </div>
        <div className="list-product px-6">
          {wishlistState.wishlistArray.map((product) => (
            <div
              key={product.id}
              className="item flex items-center justify-between gap-3 border-b border-line py-5"
            >
              <div className="infor flex items-center gap-5">
                <div className="bg-img">
                  <Image
                    priority={false}
                    src={product.images[0]}
                    width={300}
                    height={300}
                    alt={product.name}
                    className="aspect-square w-[100px] flex-shrink-0 rounded-lg"
                  />
                </div>
                <div className="">
                  <div className="name text-button">{product.name}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="product-price text-title">
                      USD {product.price.listPrice}
                    </div>
                    <div className="product-origin-price text-title text-secondary2">
                      <del>USD {product.price.listPrice}</del>
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="remove-wishlist-btn caption1 cursor-pointer font-semibold text-red underline"
                onClick={() => removeFromWishlist(product.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="footer-modal absolute bottom-0 left-0 w-full border-t border-line bg-white p-6 text-center">
          <Link
            href={'/profile/wishlist'}
            onClick={closeModalWishlist}
            className="button-main w-full text-center uppercase"
          >
            View Wish List
          </Link>
          <button
            onClick={closeModalWishlist}
            className="text-button-uppercase has-line-before mt-4 inline-block cursor-pointer text-center"
          >
            Or continue shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalWishlist;
