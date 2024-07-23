'use client';

import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import * as Icon from '@phosphor-icons/react/dist/ssr';
import toast, { Toaster } from 'react-hot-toast';

const AccountRegistration = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');

  const router = useRouter();

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (user.password !== confirmPassword) {
      toast.error('Password and confirm password do not match');
    } else {
      const data = {
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      axios
        .post('/api/register', data)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          router.push('/login');
        });
    }
  };

  return (
    <>
      <div className="register-block py-10 md:py-20">
        <div className="container">
          <div className="content-main flex gap-y-8 max-md:flex-col">
            <div className="left w-full border-line md:w-1/2 md:border-r md:pr-[40px] lg:pr-[60px]">
              <div className="heading4">Register</div>
              <form className="mt-4 md:mt-7" onSubmit={submitHandler}>
                <div className="email">
                  <input
                    className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    placeholder="Email address *"
                    required
                  />
                </div>
                <div className="firstName">
                  <input
                    className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                    id="firstName"
                    type="firstName"
                    value={user.firstName}
                    onChange={(e) =>
                      setUser({ ...user, firstName: e.target.value })
                    }
                    placeholder="First Name *"
                    required
                  />
                </div>
                <div className="lastName">
                  <input
                    className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                    id="lastName"
                    type="lastName"
                    value={user.lastName}
                    onChange={(e) =>
                      setUser({ ...user, lastName: e.target.value })
                    }
                    placeholder="Last Name *"
                    required
                  />
                </div>
                <div className="pass mt-5">
                  <input
                    className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                    id="password"
                    type="password"
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    placeholder="Password *"
                    required
                  />
                </div>
                <div className="confirm-pass mt-5">
                  <input
                    className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    placeholder="Confirm Password *"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mt-5 flex items-center">
                  <div className="block-input">
                    <input type="checkbox" name="remember" id="remember" />
                    <Icon.CheckSquare
                      size={20}
                      weight="fill"
                      className="icon-checkbox"
                    />
                  </div>
                  <label
                    htmlFor="remember"
                    className="cursor-pointer pl-2 text-secondary2"
                  >
                    I agree to the
                    <Link
                      href={'#!'}
                      className="pl-1 text-black hover:underline"
                    >
                      Terms of User
                    </Link>
                  </label>
                </div>
                <div className="block-button mt-4 md:mt-7">
                  <button type="submit" className="button-main">
                    Register
                  </button>
                </div>
              </form>
            </div>
            <div className="right flex w-full items-center md:w-1/2 md:pl-[40px] lg:pl-[60px]">
              <div className="text-content">
                <div className="heading4">Already have an account?</div>
                <div className="mt-2 text-secondary">
                  Welcome back. Sign in to access your personalized experience,
                  saved preferences, and more. We{String.raw`'re`} thrilled to
                  have you with us again!
                </div>
                <div className="block-button mt-4 md:mt-7">
                  <Link href={'/login'} className="button-main">
                    Login
                  </Link>
                </div>
              </div>
            </div>
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

export default AccountRegistration;
