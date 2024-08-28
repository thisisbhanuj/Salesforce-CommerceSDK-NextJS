import React from 'react';

import { CartProvider } from '@/context/CartContext';
import { ModalCartProvider } from '@/context/ModalCartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ModalWishlistProvider } from '@/context/ModalWishlistContext';
import { CompareProvider } from '@/context/CompareContext';
import { ModalCompareProvider } from '@/context/ModalCompareContext';
import { ModalSearchProvider } from '@/context/ModalSearchContext';
import { ModalQuickviewProvider } from '@/context/ModalQuickviewContext';
import { CustomizationProvider } from '@/context/CustomizationContext';

import { isAuthenticatd } from '@/lib/session';
import { CartType } from '@/CartType';

type cartContent =
  | {
      success: boolean | null;
      message: string | null;
      userCartModel: {} | CartType | null;
    }
  | null
  | {};

const GlobalProvider: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  let cartContent: cartContent = null;

  return (
    <CustomizationProvider>
      <CartProvider cartContent={cartContent}>
        <ModalCartProvider>
          <WishlistProvider>
            <ModalWishlistProvider>
              <CompareProvider>
                <ModalCompareProvider>
                  <ModalSearchProvider>
                    <ModalQuickviewProvider>{children}</ModalQuickviewProvider>
                  </ModalSearchProvider>
                </ModalCompareProvider>
              </CompareProvider>
            </ModalWishlistProvider>
          </WishlistProvider>
        </ModalCartProvider>
      </CartProvider>
    </CustomizationProvider>
  );
};

export default GlobalProvider;
