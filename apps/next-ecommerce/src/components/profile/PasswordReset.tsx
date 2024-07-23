'use client';

import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

const PasswordReset = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const resetPasswordActionHandler = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const newPassword = (
      document.getElementById('new-password') as HTMLInputElement
    ).value;
    const confirmPassword = (
      document.getElementById('confirm-password') as HTMLInputElement
    ).value;
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const response = await axios.post('/api/profile/reset', {
      token: token,
      password: newPassword,
    });

    if (response.status === 201) {
      toast.success('Password changed. Redirecting to login page...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    } else {
      toast.error('Password reset failed');
    }
  };

  return (
    <>
      {!token ? (
        <div className="container mt-10 text-center">
          <h1 className="text-3xl font-bold">Invalid Token</h1>
          <p className="mt-4 text-lg">
            The token is invalid or expired. Please request a new password reset
            link.
          </p>
        </div>
      ) : (
        <div className="forgot-pass py-10 md:py-20">
          <div className="container">
            <div className="content-main flex gap-y-8 max-md:flex-col">
              <div className="body1 mt-2 flex w-full flex-col justify-center text-center">
                <form
                  className="mt-4 md:mt-7"
                  onSubmit={resetPasswordActionHandler}
                >
                  <div className="password grid justify-center">
                    <input
                      className="rounded-lg border-line px-4 pb-3 pt-3"
                      id="new-password"
                      type="password"
                      name="new-password"
                      placeholder="New Password *"
                      required
                    />
                    <input
                      className="mt-4 rounded-lg border-line px-4 pb-3 pt-3"
                      id="confirm-password"
                      type="password"
                      name="confirm-password"
                      placeholder="Confirm Password *"
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
            </div>
          </div>
        </div>
      )}
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

export default PasswordReset;
