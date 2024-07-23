'use client';

import React, { useState, useEffect, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import InteractiveDiv from '@/components/ui/interactiveDiv';
import { applyVoucherOnCart } from '@/actions/cart.actions';
interface Voucher {
  code: string;
  discount: number; // Percentage discount
  minOrder: number; // Minimum order amount for discount
}

interface PageProps {
  totalCart: number;
  existingCouponCode?: string;
  existingDiscount?: number;
  isAuthenticated: boolean;
}

const Promotions: React.FC<PageProps> = ({
  totalCart,
  existingCouponCode,
  existingDiscount,
  isAuthenticated
}) => {
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const vouchers: Voucher[] = useMemo(
    () => [
      {
        code: 'WELCOME10',
        discount: 10,
        minOrder: 50,
      },
      {
        code: 'SUMMER20',
        discount: 20,
        minOrder: 100,
      },
      {
        code: 'FREESHIP',
        discount: 100,
        minOrder: 500,
      },
    ],
    [],
  );

  useEffect(() => {
    if (!vouchers) return;

    const applicableVoucher = vouchers.find((voucher) => {
      if (existingCouponCode) {
        return voucher.code === existingCouponCode.toUpperCase();
      }
      return totalCart >= voucher.minOrder;
    });

    setAppliedVoucher(applicableVoucher ?? null);

    if (existingDiscount) {
      setDiscountAmount(existingDiscount);
    } else if (applicableVoucher) {
      setDiscountAmount(
        Math.floor((totalCart / 100) * applicableVoucher.discount),
      );
    }
  }, [totalCart, vouchers, existingCouponCode, existingDiscount]);

  const handleApplyVoucher = async (voucher: Voucher) => {
    if (!isAuthenticated) {
      toast.error('Please login to apply voucher');
      return;
    }

    if (totalCart < voucher.minOrder) {
      toast.error(`Minimum order must be ${voucher.minOrder} USD`);
      return;
    }

    if (appliedVoucher?.code === voucher.code) {
      toast.error('Voucher already applied');
      return;
    }

    const discountAmount = Math.floor((totalCart / 100) * voucher.discount);

    if (discountAmount <= 0) {
      toast.error('Discount amount must be greater than 0');
      return;
    }

    const response = await applyVoucherOnCart(
      voucher.code,
      discountAmount,
      voucher.discount,
    );

    if (!response) {
      toast.error('Voucher could not be applied.');
      return;
    }

    toast.success('Voucher applied!');

    setAppliedVoucher(voucher);
    setDiscountAmount(discountAmount);
  };

  return (
    <>
      <div className="discount-section">
        <div className="list-voucher mt-5 grid grid-cols-2 gap-5 sm:mt-7 sm:grid-cols-3">
          {vouchers?.map((voucher) => (
            <div
              key={voucher.code}
              className={`voucher-item ${appliedVoucher?.code === voucher.code ? 'applied bg-green' : ''} flex rounded-lg border border-line py-2 max-sm:flex-col`}
            >
              <div className="voucher-details top flex-1 justify-between gap-10 border-b border-dashed border-line px-3 pb-2">
                <div className="discount-info">
                  <span className="caption1 font-bold">
                    {voucher.discount}% OFF
                  </span>
                </div>
                <div className="min-order">
                  <div className="caption1">For orders above</div>
                  <span className="caption1 font-bold">
                    {voucher.minOrder} USD
                  </span>
                </div>
              </div>
              <div className="bottom flex items-center justify-between gap-6 px-3 pt-2">
                <div className="text-button-uppercase">{voucher.code}</div>
                <InteractiveDiv
                  className={`button-main px-2.5 py-1 text-xs capitalize ${
                    appliedVoucher?.code === voucher.code || totalCart <= 0
                      ? 'disabled'
                      : ''
                  }`}
                  onClickHandler={() => handleApplyVoucher(voucher)}
                >
                  {appliedVoucher?.code === voucher.code
                    ? 'Applied'
                    : 'Apply Code'}
                </InteractiveDiv>
              </div>
            </div>
          ))}
        </div>
        {appliedVoucher && (
          <div className="applied-details mt-2 text-lg text-red">
            <span className="caption1">Applied Discount: </span>
            <span className="caption1 font-bold">{discountAmount} USD</span>
          </div>
        )}
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

export default Promotions;
