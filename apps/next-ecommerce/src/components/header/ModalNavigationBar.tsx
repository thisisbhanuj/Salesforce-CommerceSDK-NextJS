import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import * as Icon from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useCart } from '@/context/CartContext';

type Props = {
  openModalSearch: () => void;
  handleLoginPopup: () => void;
  openModalWishlist: () => void;
  openModalCart: () => void;
  openLoginPopup: boolean;
};

const ModalNavigationBar: React.FC<Props> = ({
  openModalSearch,
  openLoginPopup,
  handleLoginPopup,
  openModalWishlist,
  openModalCart,
}) => {
  const pathname = usePathname();
  const { data: client_session, status } = useSession();
  const loading = status === 'loading';
  const authenticated = status === 'authenticated';

  const { cartState } = useCart();

  function logoutHandler() {
    signOut();
  }

  return (
    <div className="right flex gap-12">
      <div className="search-icon relative flex cursor-pointer items-center max-md:hidden">
        <Icon.MagnifyingGlass
          size={24}
          color="black"
          onClick={openModalSearch}
        />
        <div className="line absolute -right-6 h-6 w-px bg-line"></div>
      </div>
      <div className="list-action flex items-center gap-4">
        <div className="user-icon flex cursor-pointer items-center justify-center">
          <Icon.User size={24} color="black" onClick={handleLoginPopup} />
          <div
            className={`login-popup box-shadow-small absolute top-[74px] w-[320px] rounded-xl bg-white p-7 ${openLoginPopup ? 'open' : ''}`}
          >
            {!client_session && !loading && (
              <div>
                <Link
                  href={'/login'}
                  className="button-main w-full text-center"
                >
                  Sign In
                </Link>
                <div className="mt-3 pb-4 text-center text-secondary">
                  Don’t have an account?
                  <Link
                    href={'/register'}
                    className="pl-1 text-black hover:underline"
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}
            {client_session && authenticated && (
              <div>
                <Link href="/profile" className="mt-3 pb-4 text-center">
                  My Account
                </Link>
                <div className="bottom mt-3 border-t border-line pt-4"></div>
                <Link
                  href={'/profile/wishlist'}
                  className="mt-3 pb-4 text-center"
                >
                  Wishlist
                </Link>
                <div className="bottom mt-3 border-t border-line pt-4"></div>
                <Link
                  href={'/profile/orders'}
                  className="mt-3 pb-4 text-center"
                >
                  Orders
                </Link>
                <div className="bottom mt-3 border-t border-line pt-4"></div>
                <div className="mt-3 pb-4">
                  <Link
                    href={'/'}
                    className="button-main w-full text-center"
                    onClick={logoutHandler}
                  >
                    Sign Out
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        <button
          className="wishlist-icon flex cursor-pointer items-center max-md:hidden"
          onClick={openModalWishlist}
        >
          <Icon.Heart size={24} color="black" />
        </button>
        <button
          className={`cart-icon relative flex cursor-pointer items-center ${pathname.includes('checkout') ? 'hidden' : ''}`}
          onClick={openModalCart}
        >
          <Icon.Handbag size={24} color="black" />
          <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs text-white">
            {cartState?.cartArray?.length ?? 0}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ModalNavigationBar;
