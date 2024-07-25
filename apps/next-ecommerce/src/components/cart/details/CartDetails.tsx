import React from 'react';
import Image from 'next/image';

import * as Icon from '@phosphor-icons/react/dist/ssr';
import { CartItem, CartType } from '../../../../types/CartType';

interface CartDetailsProps {
  cartModel: CartType;
  handleQuantityChange: (
    id: string,
    cumulativeQuantity: number,
    size: string,
    color: string,
  ) => void;
  handleRemoveProduct: (id: string) => void;
}

const CartDetails: React.FC<CartDetailsProps> = ({
  cartModel,
  handleQuantityChange,
  handleRemoveProduct,
}) => {
  const commerceItems: CartItem[] = cartModel?.commerceItems ?? [];

  return (
    <div className="list-product mt-5 flex flex-shrink-0 sm:mt-7">
      <div className="w-full">
        <div className="heading bora-4 bg-surface pb-4 pt-4">
          <div className="flex">
            <div className="w-1/2">
              <div className="text-button text-center">Products</div>
            </div>
            <div className="w-1/12">
              <div className="text-button text-wrap text-center">Price</div>
            </div>
            <div className="w-1/6">
              <div className="text-button text-center">Qty</div>
            </div>
            <div className="w-1/6">
              <div className="text-button text-wrap text-center">
                Total Amount
              </div>
            </div>
          </div>
        </div>
        <div className="list-product-main mt-3 w-full">
          {commerceItems?.length < 1 ? (
            <p className="text-button pt-3">No products in cart</p>
          ) : (
            commerceItems?.map((product, index) => (
              <div
                className="item flex-shrink-1 mt-5 flex w-full border-b border-line pb-5 md:mt-7 md:pb-7"
                key={
                  product.ID +
                  '_' +
                  product.color +
                  '_' +
                  product.size +
                  '_' +
                  index
                }
              >
                <div className="w-1/2">
                  <div className="flex items-center gap-6">
                    <div className="bg-img aspect-[3/4] w-20 md:w-[100px]">
                      <Image
                        priority={false}
                        src={product.image}
                        width={1000}
                        height={1000}
                        alt={product.name}
                        className="h-full w-full rounded-lg object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-title text-wrap">{product.name}</div>
                    </div>
                  </div>
                </div>
                <div className="price flex w-1/12 items-center justify-center">
                  <div className="text-title text-center">
                    {product.isCustomized
                      ? product.totalAmountWithCustomizations
                      : product.price}
                  </div>
                </div>
                <div className="flex w-1/6 items-center justify-center">
                  <div className="quantity-block flex w-20 flex-shrink-0 items-center justify-between rounded-lg border border-line bg-surface p-2 md:w-[100px] md:p-3">
                    <Icon.Minus
                      onClick={() => {
                        if (product.quantity > 1) {
                          handleQuantityChange(
                            product.ID,
                            product.quantity - 1,
                            product.size,
                            product.color,
                          );
                        }
                      }}
                      className={`text-base max-md:text-sm ${product.quantity === 1 ? 'disabled' : ''}`}
                    />
                    <div className="text-button quantity">
                      {product.quantity}
                    </div>
                    <Icon.Plus
                      onClick={() =>
                        handleQuantityChange(
                          product.ID,
                          product.quantity + 1,
                          product.size,
                          product.color,
                        )
                      }
                      className="text-base max-md:text-sm"
                    />
                  </div>
                </div>
                <div className="total-price flex w-1/6 items-center justify-center">
                  <div className="text-title text-center">
                    {' '}
                    {product.isCustomized
                      ? (product.totalAmountWithCustomizations ??
                        0 * product.quantity)
                      : product.price * product.quantity}
                  </div>
                </div>
                <div className="flex w-1/12 items-center justify-center">
                  <Icon.XCircle
                    className="cursor-pointer text-xl text-red duration-500 hover:text-black max-md:text-base"
                    onClick={() => {
                      handleRemoveProduct(product.ID);
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDetails;
