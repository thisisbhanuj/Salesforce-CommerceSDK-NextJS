'use client';

import React from 'react';
import Link from 'next/link';

import { forgotPasswordAction } from '@/actions/user.actions';
import { useFormState } from 'react-dom';

const ForgotPassword = () => {
  const [formState, forgotPasswordHandler] = useFormState(
    (prevState: { success: boolean; message?: string }, formData: FormData) =>
      forgotPasswordAction(prevState, formData),
    { success: false, message: '' },
  );

  return (
    <div className="forgot-pass py-10 md:py-20">
      <div className="container">
        <div className="content-main flex gap-y-8 max-md:flex-col">
          {formState.success ? (
            <div className="body1 mt-2 flex w-full flex-col justify-center text-center">
              {formState.message}
              <div className="block-button mt-4 md:mt-7">
                <Link href={'/'} className="button-main">
                  Home
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="left w-full border-line md:w-1/2 md:border-r md:pr-[40px] lg:pr-[60px]">
                <div className="heading4">Reset your password</div>
                <div className="body1 mt-2">
                  We will send you an email to reset your password
                </div>
                <form className="mt-4 md:mt-7" action={forgotPasswordHandler}>
                  <div className="email">
                    <input
                      className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Email address *"
                      required
                    />
                  </div>
                  <div className="block-button mt-4 md:mt-7">
                    <button type="submit" className="button-main">
                      Reset Password
                    </button>
                  </div>
                </form>
              </div>
              <div className="right flex w-full items-center md:w-1/2 md:pl-[40px] lg:pl-[60px]">
                <div className="text-content">
                  <div className="heading4">New Customer</div>
                  <div className="mt-2 text-secondary">
                    Be part of our growing family of new customers! Join us
                    today and unlock a world of exclusive benefits, offers, and
                    personalized experiences.
                  </div>
                  <div className="block-button mt-4 md:mt-7">
                    <Link href={'/register'} className="button-main">
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
