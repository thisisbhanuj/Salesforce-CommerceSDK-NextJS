'use client';

import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import ShippingForm from '@/components/checkout/shipping/ShippingForm';
import PaymentForm from '@/components/checkout/payment/PaymentForm';
import CartSummary from '@/components/checkout/CartSummary';
import { useCart } from '@/context/CartContext';
import { CartType } from '../../../types/CartType';
import { ShippingAddressType } from '../../../types/CheckoutType';
import { fetchStripeCharge } from '@/actions/payment.actions';
import {
  addShippingAddressToCart,
  deleteCart,
  fetchCartForUser,
} from '@/actions/cart.actions';
import { submitOrder } from '@/actions/order.actions';
//import { submitOrder } from '@/utility/orderHelper'

const CheckoutContainer = () => {
  const discount = 0;
  const ship = 0;

  const [fetchAddress, setFetchAddress] = useState(false);
  const [shippingAddressModel, setShippingAddressModel] = useState<
    ShippingAddressType[] | []
  >([]);
  const [cartModel, setCartModel] = useState<CartType>();
  const [selectedAddress, setSelectedAddress] = useState('');
  const { loadCart } = useCart();

  const [section, setSection] = useState('Shipping');

  const fetchCartfromDB = async (message: string) => {
    console.log('fetchCartfromDB : ', message);
    try {
      const response = await fetchCartForUser();
      if (response?.success && response?.userCartModel) {
        const userCartModel =
          typeof response.userCartModel === 'string'
            ? JSON.parse(response.userCartModel)
            : response.userCartModel;

        const shippingGroups: [] = JSON.parse(
          response?.shippingGroups?.toString() ?? '[]',
        );
        setShippingAddressModel(shippingGroups);
        setCartModel(userCartModel);
      }
    } catch (error) {
      console.error('Failed to fetch cart on checkout', error);
    }
  };

  const saveAddressInCart = async (address: string) => {
    await addShippingAddressToCart(address);
  };

  useEffect(() => {
    if (fetchAddress) {
      fetchCartfromDB('New Address');
    }
  }, [fetchAddress]);

  useEffect(() => {
    fetchCartfromDB('Initial Load');
  }, []);

  useEffect(() => {
    if (selectedAddress) {
      const saveSAinSessionStorage = async () => {
        try {
          sessionStorage.setItem('selectedAddress', selectedAddress);
        } catch (error) {
          console.error('Failed to save address on cart', error);
        }
      };
      saveSAinSessionStorage();
      saveAddressInCart(selectedAddress);
    }
  }, [selectedAddress]);

  async function cleanUp(cartId: string) {
    sessionStorage.removeItem('selectedAddress');
    const emptyCart = await deleteCart(cartId);
    if (emptyCart?.success) {
      loadCart([]);
    } else {
      console.error('Failed to delete cart in DB: ', emptyCart);
    }
  }

  const handleOrderSubmit = async (paymentIntentId: string) => {
    const result = await fetchStripeCharge(paymentIntentId);
    if (
      result?.success &&
      result?.chargeId &&
      paymentIntentId &&
      cartModel?.ID
    ) {
      const submitOrderResult = await submitOrder(
        cartModel.ID,
        paymentIntentId,
        result.chargeId,
      );
      if (
        submitOrderResult?.success &&
        submitOrderResult.order &&
        submitOrderResult.cartId
      ) {
        setSection('Order Confirmation');
        cleanUp(cartModel.ID);
      } else {
        toast.error(submitOrderResult?.error ?? 'Failed to submit order');
      }
    }
  };

  return (
    <>
      <div className="py-10 md:py-20">
        <div className="container">
          <div className="checkout-block flex justify-between">
            {section === 'Order Confirmation' ? (
              <div className="order-confirmation">
                <h1>Order Confirmed</h1>
                <p>Your order has been placed successfully.</p>
                <p>Thank you for shopping with us!</p>
              </div>
            ) : (
              <>
                <div className="left">
                  {section === 'Shipping' && (
                    <ShippingForm
                      setSection={setSection}
                      setFetchAddress={setFetchAddress}
                      shippingAddressModel={shippingAddressModel}
                      setSelectedAddress={setSelectedAddress}
                      isAddressSelected={!!selectedAddress}
                      selectedAddress={selectedAddress}
                    />
                  )}
                  {section === 'Payment' && (
                    <PaymentForm
                      cartModel={cartModel}
                      orderSubmitHandler={handleOrderSubmit}
                    />
                  )}
                </div>
                <div className="right">
                  {cartModel ? (
                    <CartSummary
                      cartModel={cartModel}
                      discount={discount}
                      ship={ship}
                    />
                  ) : (
                    <>
                      <Skeleton count={1} height={200} width={400} />
                      <Skeleton count={1} height={40} width={400} />
                      <Skeleton count={1} height={40} width={400} />
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
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
    </>
  );
};

export default CheckoutContainer;
