import React from 'react';
import Image from 'next/image';
import { CartType } from '@/CartType';

type CartSummaryProps = {
  cartModel: CartType | undefined;
  discount: number;
  ship: number;
};

const CartSummary: React.FC<CartSummaryProps> = ({
  cartModel,
  discount,
  ship,
}) => {
  return (
    <>
      <div className="heading5 mt-2 pb-3">Order Summary</div>
      <div className="list-product-checkout">
        {cartModel?.commerceItems?.length === 0 ? (
          <p className="text-button pt-3">No product in cart</p>
        ) : (
          cartModel?.commerceItems?.map((product) => (
            <div
              className="item flex-shrink-2 mt-5 flex w-full items-center justify-between gap-6 border-b border-line pb-5"
              key={product.ID + '_' + product.color}
            >
              <div className="bg-img aspect-square w-[100px] overflow-hidden rounded-lg">
                <Image
                  priority={false}
                  src={product.image}
                  width={500}
                  height={500}
                  alt="img"
                  className="mobile-image"
                />
              </div>
              <div className="flex w-full items-center justify-between">
                <div>
                  <div className="name text-title checkout-cart-text text-nowrap">
                    {product.name}
                  </div>
                  <div className="mt-2 text-secondary">
                    <span className="size checkout-cart-text capitalize">
                      {product.size}
                    </span>
                    <span>/</span>
                    <span className="color checkout-cart-text capitalize">
                      {product.color}
                    </span>
                  </div>
                </div>
                <div className="text-title">
                  <span className="quantity checkout-cart-text">
                    {product.quantity}
                  </span>
                  <span className="px-1">x</span>
                  <span>{product.price}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {Number(discount) > 0 && (
        <div className="discount-block flex justify-between border-b border-line py-5">
          <div className="text-title">Discounts</div>
          <div className="text-title">
            <span className="discount">{discount}</span>
          </div>
        </div>
      )}
      <div className="ship-block flex justify-between border-b border-line py-5">
        <div className="text-title">Shipping</div>
        <div className="text-title">
          {Number(ship) === 0 ? 'Free' : `${ship}`}
        </div>
      </div>
      <div className="total-cart-block flex justify-between pt-5">
        <div className="heading5">Total</div>
        <div className="heading5 total-cart">
          USD {cartModel?.totalPrice ?? 0 - Number(discount) + Number(ship)}
        </div>
      </div>
    </>
  );
};

export default CartSummary;
