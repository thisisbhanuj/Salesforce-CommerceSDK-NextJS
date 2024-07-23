'use client';

import React, { FormEvent, useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import * as Icon from '@phosphor-icons/react/dist/ssr';
import Button from '@/components/ui/button';

const LoginComponent = () => {
  const goBackURL = useSearchParams().get('callbackUrl') ?? '/';

  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const data = {
      email: user.email,
      password: user.password,
      redirect: true,
      callbackUrl: goBackURL,
    };
    try {
      await signIn('credentials', data);
    } catch (error) {
      console.error(error);
    }
  };

  const googleSignIn = async () => {
    try {
      await signIn('google');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-block py-10 md:py-20">
      <div className="container">
        <div className="content-main flex gap-y-8 max-md:flex-col">
          <div className="left w-full border-line md:w-1/2 md:border-r md:pr-[40px] lg:pr-[60px]">
            <div className="heading4">Login</div>
            <form className="mt-4 md:mt-7" onSubmit={submitHandler}>
              <div className="email">
                <input
                  className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                  id="username"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  placeholder="Username or email address *"
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
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="block-input">
                    <input type="checkbox" name="remember" id="remember" />
                    <Icon.CheckSquare
                      size={20}
                      weight="fill"
                      className="icon-checkbox"
                    />
                  </div>
                  <label htmlFor="remember" className="cursor-pointer pl-2">
                    Remember me
                  </label>
                </div>
                <Link
                  href={'/forgot-password'}
                  className="font-semibold hover:underline"
                >
                  Forgot Your Password?
                </Link>
              </div>
              <div className="block-button mt-4 flex justify-center md:mt-7">
                <Button
                  type="submit"
                  label="Login"
                  className="button-main w-full md:mb-0 md:ml-0 md:mr-2 md:mt-0 md:w-[50%]"
                ></Button>
              </div>
              <div className="mt-4 flex justify-center">OR</div>
              <div className="block-button mt-2 flex justify-center md:mt-4">
                <Button
                  type="submit"
                  onClick={googleSignIn}
                  label="Sign in with Google"
                  className="md:mb-0rounded-md flex w-full justify-center gap-2 text-nowrap border border-input bg-background text-sm font-medium text-accent-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none md:ml-0 md:mr-2 md:mt-0 md:w-[50%]"
                ></Button>
              </div>
            </form>
          </div>
          <div className="right flex w-full items-center md:w-1/2 md:pl-[40px] lg:pl-[60px]">
            <div className="text-content">
              <div className="heading4">New Customer</div>
              <div className="mt-2 text-secondary">
                Be part of our growing family of new customers! Join us today
                and unlock a world of exclusive benefits, offers, and
                personalized experiences.
              </div>
              <div className="block-button mt-4 md:mt-7">
                <Link
                  href={'/register'}
                  className="button-main w-full md:mb-0 md:ml-0 md:mr-2 md:mt-0 md:w-[50%]"
                >
                  <div className="flex justify-center">Register</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
