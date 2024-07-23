'use client';

import React from 'react';
import { Session } from 'next-auth';
import Link from 'next/link';
import * as Icon from '@phosphor-icons/react/dist/ssr';
import { useSession, signOut } from 'next-auth/react';

import useLoginPopup from '@/hooks/useLoginPopup';

interface Props {
  props: string;
  session: Session;
}

const Menu: React.FC<Props> = ({ props, session }) => {
  const { openLoginPopup, handleLoginPopup } = useLoginPopup();

  const { data: client_session, status } = useSession();
  const loading = status === 'loading';
  const authenticated = status === 'authenticated';

  function logoutHandler() {
    signOut();
  }

  return (
    <div
      className={`header-menu absolute left-0 right-0 top-0 h-[56px] w-full md:h-[74px] ${props}`}
    >
      <div className="container mx-auto h-full">
        <div className="header-main flex h-full justify-between">
          <div className="left flex items-center gap-16">
            <Link
              href={'/'}
              className="flex items-center max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2"
            >
              <div className="heading4">BHANUJ</div>
            </Link>
          </div>
          <div className="right flex gap-12">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
