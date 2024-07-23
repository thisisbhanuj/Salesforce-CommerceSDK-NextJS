import React, { useState } from 'react';
import Link from 'next/link';
import { CartType } from '@/CartType';
import Button from '@/components/ui/button';

interface Props {
  cartModel: CartType;
  redirectToLogin: () => void;
  redirectToCheckout: () => void;
  isAuthenticated: boolean;
}

const Summary: React.FC<Props> = ({
  cartModel,
  redirectToLogin,
  redirectToCheckout,
  isAuthenticated,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    isAuthenticated ? redirectToCheckout() : redirectToLogin();
  };

  return (
    <>
      {!!cartModel && !!cartModel.totalPrice && (
        <div className="w-full xl:w-1/3 xl:pl-12">
          <div className="checkout-block rounded-2xl bg-surface p-6">
            <div className="heading5">Summary</div>
            <div className="total-block flex justify-between border-b border-line py-5">
              <div className="text-title">Subtotal</div>
              <div className="text-title">
                <span className="total-product">{cartModel.totalPrice}</span>
                <span></span>
              </div>
            </div>
            <div className="discount-block flex justify-between border-b border-line py-5">
              <div className="text-title">Discounts</div>
              <div className="text-title">
                {' '}
                <span></span>
                <span className="discount">{cartModel.totalDiscount}</span>
                <span></span>
              </div>
            </div>
            <div className="ship-block flex justify-between border-b border-line py-5">
              <div className="text-title">Shipping</div>
              <div className="choose-type flex gap-12">
                <div className="left"></div>
                <div className="right">
                  <div className="ship">FREE</div>
                </div>
              </div>
            </div>
            <div className="total-cart-block flex justify-between pb-4 pt-4">
              <div className="heading5">Total</div>
              <div className="heading5">
                <span className="total-cart heading5">
                  USD{' '}
                  {cartModel.totalPrice -
                    (cartModel.orderDiscount ?? 0) +
                    cartModel.shippingPrice}
                </span>
                <span className="heading5"></span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="block-button mt-5 flex flex-col items-center gap-y-4">
        <Button
          type="button"
          label={isAuthenticated ? 'Checkout' : 'Login To Checkout'}
          className={`checkout-btn button-main w-full max-w-md text-center ${cartModel.totalPrice <= 0 ? 'invalid-amount' : ''}`}
          onClick={handleClick}
          disabled={cartModel.totalPrice <= 0}
          loading={isLoading ? true : undefined}
        />
        <Link className="text-button font-bold" href={'/'}>
          Continue Shopping
        </Link>
      </div>
    </>
  );
};

export default Summary;
