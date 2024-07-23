'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { useCart } from '@/context/CartContext';
import {
  updateCartQuantityAndTotals,
  removeItemFromCartById,
} from '@/actions/cart.actions';

import Footer from '@/components/footer/Footer';
import Promotions from '@/components/cart/promotions/Promotions';
import Summary from '@/components/cart/summary/Summary';
import CartDetails from '@/components/cart/details/CartDetails';
import Banner from '@/components/cart/details/Banner';
import { useRouter } from 'next/navigation';
import { CartItem, CartType } from '@/CartType';

type CartProps = {
  cartContent: {
    success: boolean;
    message: string;
    userCartModel: string;
  };
};

const CartContainer: React.FC<CartProps> = ({ cartContent }) => {
  const { cartState, updateCart, loadCart, removeFromCart } = useCart();
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const currentUrl = window.location.href;
    if (currentUrl.includes('#customization')) {
      // Remove the fragment using replaceState
      window.history.replaceState(
        {},
        document.title,
        currentUrl.replace(/#customization$/, ''),
      );
      // Reload the page after fragment removal
      window.location.reload();
    }
  }, []);

  const [cartModel, setCartModel] = useState<CartType>({} as CartType);

  const handleQuantityChange = async (
    productId: string,
    cumulativeQuantity: number,
    selectedSize: string,
    selectedColor: string,
  ) => {
    const itemToUpdate = cartState.cartArray.find(
      (item) =>
        item.ID === productId &&
        item.size === selectedSize &&
        item.color === selectedColor,
    );
    if (itemToUpdate) {
      const result = await updateCartQuantityAndTotals(
        productId,
        cumulativeQuantity,
        selectedColor,
        selectedSize,
      );
      if (result?.success && result?.userCartModel) {
        const cartModel = JSON.parse(result.userCartModel.toString()) ?? {};
        console.log('Cart updated:', cartModel);
        updateCart(
          itemToUpdate.ID,
          cumulativeQuantity,
          selectedSize,
          selectedColor,
        );
      } else {
        console.error('Failed to update cart quantity:', result);
      }
    }
  };

  const handleRemoveProduct = async (ID: string) => {
    const result = await removeItemFromCartById(ID);
    if (result?.success && result?.userCartModel) {
      const cartModel = JSON.parse(result.userCartModel.toString()) ?? {};
      console.log('Cart updated:', cartModel);
      removeFromCart(ID);
    } else {
      console.error('Failed to remove: ', result);
    }
  };

  const redirectToLogin = () => {
    router.push('/login');
  };

  const redirectToCheckout = async () => {
    router.push('/checkout');
  };

  useEffect(() => {
    if (cartContent.success && cartContent.userCartModel) {
      const currentCartModel =
        JSON.parse(cartContent.userCartModel.toString()) ?? {};
      setCartModel(currentCartModel);

      const commerceItems =
        currentCartModel.commerceItems ?? ([] as CartItem[]);
      loadCart(commerceItems);
    }
  }, [cartContent.success, cartContent.userCartModel]);

  return (
    <>
      <div className="cart-block py-10 md:py-20">
        <div className="container">
          <div className="content-main flex justify-between gap-y-8 max-xl:flex-col">
            <div className="w-full xl:w-2/3 xl:pr-3">
              {cartModel.finalOrderAmount > 0 ? <Banner /> : ''}
              <CartDetails
                cartModel={cartModel}
                handleQuantityChange={handleQuantityChange}
                handleRemoveProduct={handleRemoveProduct}
              />
              <Promotions
                totalCart={cartModel.totalPrice}
                existingCouponCode={cartModel.voucher}
                existingDiscount={cartModel.orderDiscount}
                isAuthenticated={
                  cartContent.success && status === 'authenticated'
                }
              />
            </div>
            <Summary
              cartModel={cartModel}
              redirectToLogin={redirectToLogin}
              redirectToCheckout={redirectToCheckout}
              isAuthenticated={
                cartContent.success && status === 'authenticated'
              }
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartContainer;
