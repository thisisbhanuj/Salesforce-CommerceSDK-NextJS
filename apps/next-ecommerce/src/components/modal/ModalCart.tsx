'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as Icon from '@phosphor-icons/react/dist/ssr';

import { CommerceItemType } from '../../../types/CartType';
import { useModalCartContext } from '@/context/ModalCartContext';
import { useCart } from '@/context/CartContext';
import { countdownTime } from '@/utility/countdownTime';
import CountdownTimeType from '../../../types/CountdownType';

import { addSkuToCart } from '@/actions/cart.actions';

interface CartItem extends CommerceItemType {
  selectedSize: string;
  selectedColor: string;
}

const ModalCart = ({
  serverTimeLeft,
}: {
  serverTimeLeft: CountdownTimeType;
}) => {
  const [timeLeft, setTimeLeft] = useState(serverTimeLeft);
  const { isModalOpen, closeModalCart } = useModalCartContext();
  const { cartState, loadCart, removeFromCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  //const [activeTab, setActiveTab] = useState<string | undefined>('')

  let moneyForFreeship = 150;
  let totalCart = 0;
  cartState?.cartArray?.map(
    (item) => (totalCart += item.price * item.quantity),
  );

  const handleAddToCart = (productId: string) => {
    setSelectedVariant(productId);
  };

  useEffect(() => {
    async function addToCart() {
      const result = await addSkuToCart(
        selectedVariant,
        'activeColor',
        'activeSize',
        1,
      );
      if (result?.success && result.userCartModel) {
        const cartModel = JSON.parse(result.userCartModel.toString()) ?? {};
        const commerceItems = cartModel.commerceItems ?? ([] as CartItem[]);
        loadCart(commerceItems);
      }
    }

    if (selectedVariant) {
      addToCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariant]);

  useEffect(() => {
    const timer = setInterval(() => {
      const time = countdownTime();
      //console.log(time)
      setTimeLeft(time);
    }, 300000);

    return () => clearInterval(timer);
  }, []);

  // const handleActiveTab = (tab: string) => {
  //     setActiveTab(tab)
  // }

  return (
    <div className={`modal-cart-block`} onClick={closeModalCart}>
      <div
        className={`modal-cart-main flex ${isModalOpen ? 'open' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="left w-1/2 border-r border-line py-6 max-md:hidden">
          <div className="heading5 px-6 pb-3">You May Also Like</div>
          <div className="list px-6">
            {cartState?.cartArray?.slice(0, 4).map((product) => (
              <div
                key={product.ID}
                className="item flex items-center justify-between gap-3 border-b border-line py-5"
              >
                <div className="infor flex items-center gap-5">
                  <div className="bg-img">
                    <Image
                      priority={false}
                      src={product.image}
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
                        USD {product.price}
                      </div>
                      <div className="product-origin-price text-title text-secondary2">
                        <del>USD {product.price}</del>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-black bg-white text-xl duration-300 hover:bg-black hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product.ID);
                  }}
                >
                  <Icon.Handbag />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="right cart-block relative w-full overflow-hidden py-6 md:w-1/2">
          <div className="heading relative flex items-center justify-between px-6 pb-3">
            <div className="heading5">Cart</div>
            <button
              className="close-btn absolute right-6 top-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-surface duration-300 hover:bg-black hover:text-white"
              onClick={closeModalCart}
            >
              <Icon.X size={14} />
            </button>
          </div>
          <div className="time px-6">
            <div className="flex items-center gap-3 rounded-lg bg-green px-5 py-3">
              <p className="text-3xl">🔥</p>
              <div className="caption1">
                Your cart will expire in{' '}
                <span className="caption1 font-semibold text-red">
                  {timeLeft.minutes}:
                  {timeLeft.seconds < 10
                    ? `0${timeLeft.seconds}`
                    : timeLeft.seconds}
                </span>{' '}
                minutes!
                <br />
                Please checkout now before your items sell out!
              </div>
            </div>
          </div>
          <div className="heading banner mt-3 px-6">
            <div className="text">
              Buy{' '}
              <span className="text-button">
                {' '}
                $
                <span className="more-price">
                  {moneyForFreeship - totalCart > 0 ? (
                    <>{moneyForFreeship - totalCart}</>
                  ) : (
                    0
                  )}
                </span>
                .00{' '}
              </span>
              <span>more to get </span>
              <span className="text-button">freeship</span>
            </div>
            <div className="tow-bar-block mt-3">
              <div
                className="progress-line"
                style={{
                  width:
                    totalCart <= moneyForFreeship
                      ? `${(totalCart / moneyForFreeship) * 100}%`
                      : `100%`,
                }}
              ></div>
            </div>
          </div>
          <div className="list-product px-6">
            {cartState?.cartArray?.map((product, index) => (
              <div
                key={
                  product.ID +
                  '_' +
                  product.color +
                  '_' +
                  product.size +
                  '_' +
                  index
                }
                className="item flex items-center justify-between gap-3 border-b border-line py-5"
              >
                <div className="infor flex w-full items-center gap-3">
                  <div className="bg-img aspect-square w-[100px] flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      priority={false}
                      src={product.image}
                      width={300}
                      height={300}
                      alt={product.name}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="w-full">
                    <div className="flex w-full items-center justify-between">
                      <div className="name text-button">{product.name}</div>
                      <button
                        className="remove-cart-btn caption1 cursor-pointer font-semibold text-red underline"
                        onClick={() => removeFromCart(product.ID)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-3 flex w-full items-center justify-between gap-2">
                      <div className="flex items-center capitalize text-secondary2">
                        {product.size}/{product.color}
                      </div>
                      <div className="product-price text-title">
                        USD {product.price}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="footer-modal absolute bottom-0 left-0 w-full bg-white">
            {/* <div className="flex items-center justify-center lg:gap-14 gap-8 px-6 py-4 border-b border-line">
                            <div
                                className="item flex items-center gap-3 cursor-pointer"
                                onClick={() => handleActiveTab('note')}
                            >
                                <Icon.NotePencil className='text-xl' />
                                <div className="caption1">Note</div>
                            </div>
                            <div
                                className="item flex items-center gap-3 cursor-pointer"
                                onClick={() => handleActiveTab('shipping')}
                            >
                                <Icon.Truck className='text-xl' />
                                <div className="caption1">Shipping</div>
                            </div>
                            <div
                                className="item flex items-center gap-3 cursor-pointer"
                                onClick={() => handleActiveTab('coupon')}
                            >
                                <Icon.Tag className='text-xl' />
                                <div className="caption1">Coupon</div>
                            </div>
                        </div> */}
            <div className="flex items-center justify-between px-6 pt-6">
              <div className="heading5">Total Amount</div>
              <div className="heading5">USD {totalCart}</div>
            </div>
            <div className="block-button p-6 text-center">
              <div className="flex items-center gap-4">
                <Link
                  href={'/cart'}
                  className="button-main basis-1/2 border border-black bg-white text-center uppercase text-black"
                  onClick={closeModalCart}
                >
                  View cart
                </Link>
                <Link
                  href={'/checkout'}
                  className="button-main basis-1/2 text-center uppercase"
                  onClick={closeModalCart}
                >
                  Check Out
                </Link>
              </div>
              <button
                onClick={closeModalCart}
                className="text-button-uppercase has-line-before mt-4 inline-block cursor-pointer text-center"
              >
                Or continue shopping
              </button>
            </div>
            {/* <div className={`tab-item note-block ${activeTab === 'note' ? 'active' : ''}`}>
                            <div className="px-6 py-4 border-b border-line">
                                <div className="item flex items-center gap-3 cursor-pointer">
                                    <Icon.NotePencil className='text-xl' />
                                    <div className="caption1">Note</div>
                                </div>
                            </div>
                            <div className="form pt-4 px-6">
                                <textarea name="form-note" id="form-note" rows={4} placeholder='Add special instructions for your order...' className='caption1 py-3 px-4 bg-surface border-line rounded-md w-full'></textarea>
                            </div>
                            <div className="block-button text-center pt-4 px-6 pb-6">
                                <div className='button-main w-full text-center' onClick={() => setActiveTab('')}>Save</div>
                                <div onClick={() => setActiveTab('')} className="text-button-uppercase mt-4 text-center has-line-before cursor-pointer inline-block">Cancel</div>
                            </div>
                        </div>
                        <div className={`tab-item note-block ${activeTab === 'shipping' ? 'active' : ''}`}>
                            <div className="px-6 py-4 border-b border-line">
                                <div className="item flex items-center gap-3 cursor-pointer">
                                    <Icon.Truck className='text-xl' />
                                    <div className="caption1">Estimate shipping rates</div>
                                </div>
                            </div>
                            <div className="form pt-4 px-6">
                                <div className="">
                                    <label htmlFor='select-country' className="caption1 text-secondary">Country/region</label>
                                    <div className="select-block relative mt-2">
                                        <select
                                            id="select-country"
                                            name="select-country"
                                            className='w-full py-3 pl-5 rounded-xl bg-white border border-line'
                                            defaultValue={'Country/region'}
                                        >
                                            <option value="Country/region" disabled>Country/region</option>
                                            <option value="France">France</option>
                                            <option value="Spain">Spain</option>
                                            <option value="UK">UK</option>
                                            <option value="USA">USA</option>
                                        </select>
                                        <Icon.CaretDown size={12} className='absolute top-1/2 -translate-y-1/2 md:right-5 right-2' />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <label htmlFor='select-state' className="caption1 text-secondary">State</label>
                                    <div className="select-block relative mt-2">
                                        <select
                                            id="select-state"
                                            name="select-state"
                                            className='w-full py-3 pl-5 rounded-xl bg-white border border-line'
                                            defaultValue={'State'}
                                        >
                                            <option value="State" disabled>State</option>
                                            <option value="Paris">Paris</option>
                                            <option value="Madrid">Madrid</option>
                                            <option value="London">London</option>
                                            <option value="New York">New York</option>
                                        </select>
                                        <Icon.CaretDown size={12} className='absolute top-1/2 -translate-y-1/2 md:right-5 right-2' />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <label htmlFor='select-code' className="caption1 text-secondary">Postal/Zip Code</label>
                                    <input className="border-line px-5 py-3 w-full rounded-xl mt-3" id="select-code" type="text" placeholder="Postal/Zip Code" />
                                </div>
                            </div>
                            <div className="block-button text-center pt-4 px-6 pb-6">
                                <div className='button-main w-full text-center' onClick={() => setActiveTab('')}>Calculator</div>
                                <div onClick={() => setActiveTab('')} className="text-button-uppercase mt-4 text-center has-line-before cursor-pointer inline-block">Cancel</div>
                            </div>
                        </div>
                        <div className={`tab-item note-block ${activeTab === 'coupon' ? 'active' : ''}`}>
                            <div className="px-6 py-4 border-b border-line">
                                <div className="item flex items-center gap-3 cursor-pointer">
                                    <Icon.Tag className='text-xl' />
                                    <div className="caption1">Add A Coupon Code</div>
                                </div>
                            </div>
                            <div className="form pt-4 px-6">
                                <div className="">
                                    <label htmlFor='select-discount' className="caption1 text-secondary">Enter Code</label>
                                    <input className="border-line px-5 py-3 w-full rounded-xl mt-3" id="select-discount" type="text" placeholder="Discount code" />
                                </div>
                            </div>
                            <div className="block-button text-center pt-4 px-6 pb-6">
                                <div className='button-main w-full text-center' onClick={() => setActiveTab('')}>Apply</div>
                                <div onClick={() => setActiveTab('')} className="text-button-uppercase mt-4 text-center has-line-before cursor-pointer inline-block">Cancel</div>
                            </div>
                        </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCart;
