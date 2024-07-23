'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Session } from 'next-auth';

import useLoginPopup from '@/hooks/useLoginPopup';
import { useModalCartContext } from '@/context/ModalCartContext';
import { useModalWishlistContext } from '@/context/ModalWishlistContext';
import { useModalSearchContext } from '@/context/ModalSearchContext';
import { useCart } from '@/context/CartContext';
import Navigation from '../Navigation';
import MobileNavigation from '../MobileNavigation';
import ModalNavigationBar from '../ModalNavigationBar';
import { PrimaryCategory } from '@/Category';
import { CartType } from '@/CartType';

type CartContent =
  | {
      success: boolean | null;
      message: string | null;
      userCartModel: {} | CartType | null;
    }
  | null
  | {};

interface Props {
  props: string;
  session: Session | null;
  navigation: PrimaryCategory[];
  cartContent?: CartContent;
}

const Menu: React.FC<Props> = ({ props, session, navigation, cartContent }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { loadCart } = useCart();
  const { openLoginPopup, handleLoginPopup } = useLoginPopup();
  const { openModalCart } = useModalCartContext();
  const { openModalWishlist } = useModalWishlistContext();
  const { openModalSearch } = useModalSearchContext();

  const handleCustomization = () => {
    router.push('/customization');
  };

  const [fixedHeader, setFixedHeader] = useState(false);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  // Threshold-based update:  Instead of updating the fixedHeader state on every scroll position change,
  // we can introduce a threshold. Only when the scroll position changes by a certain amount (e.g., 250 pixels)
  // we update the state and trigger a re-render. This reduces sensitivity and avoids unnecessary updates for minor scrolls.
  const THRESHOLD = 250;

  React.useEffect(() => {
    if (pathname.includes('checkout') || pathname.includes('cart')) {
      return;
    }

    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;
      const scrollDiff = Math.abs(currentScrollPosition - lastScrollPosition);

      if (scrollDiff > THRESHOLD) {
        // scrollPosition < lastScrollPosition: This checks if the user is scrolling upwards.
        // The header should only be fixed when scrolling down or
        // staying at the same position, not when scrolling up.
        setFixedHeader(
          currentScrollPosition > 0 &&
            currentScrollPosition < lastScrollPosition,
        );
        setLastScrollPosition(currentScrollPosition);
      }
    };

    // Attach scroll event when component is mounted
    window.addEventListener('scroll', handleScroll);

    // The cleanup function removes the event listener attached to the window object.
    // This prevents memory leaks and ensures the component
    // doesn't try to interact with the DOM after it's gone.
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollPosition]); // Only re-run on lastScrollPosition change

  React.useEffect(() => {
    if (
      cartContent &&
      'success' in cartContent &&
      cartContent.success &&
      cartContent.userCartModel
    ) {
      const currentCartModel =
        JSON.parse(cartContent.userCartModel.toString()) ?? {};
      const commerceItems =
        currentCartModel.commerceItems ?? ([] as CartType['commerceItems']);
      loadCart(commerceItems);
    }
  }, [cartContent]);

  return (
    <div
      className={`header-menu ${fixedHeader ? 'fixed' : 'absolute'} left-0 right-0 top-0 h-[56px] w-full md:h-[74px] ${props}`}
    >
      <div className="container mx-auto h-full">
        <div className="header-main flex h-full justify-between">
          {!(pathname.includes('checkout') || pathname.includes('cart')) && (
            <>
              <MobileNavigation
                handleCustomization={handleCustomization}
                navModel={navigation ?? []}
              />
              <Navigation
                handleCustomization={handleCustomization}
                navModel={navigation ?? []}
              />
              <ModalNavigationBar
                openModalSearch={openModalSearch}
                openLoginPopup={openLoginPopup}
                handleLoginPopup={handleLoginPopup}
                openModalWishlist={openModalWishlist}
                openModalCart={openModalCart}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
