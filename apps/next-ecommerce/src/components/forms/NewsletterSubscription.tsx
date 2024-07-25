'use client';

import React, { useState } from 'react';
import * as Icon from '@phosphor-icons/react/dist/ssr';

import { subscribeEmailNewsletter } from '@/actions/user.actions';

const NewsletterSubscription = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSubscription = async (formData: FormData) => {
    const response = await subscribeEmailNewsletter(formData);

    if (response?.success) {
      setIsSubscribed(true);
    } else {
      setIsSubscribed(false);
      setMessage(
        response?.message || 'An error occurred. Please try again later.',
      );
    }

    setEmail('');
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setEmail('');
    setIsSubscribed(false);
    setIsModalVisible(false);
  };

  return (
    <div className="text-button-uppercase">
      Newsletter SignUp
      <div className="caption1 mt-3">
        Sign up for our newsletter and get 10% off your first purchase
      </div>
      <div className="input-block mt-4 h-[52px] w-full">
        <form className="relative h-full w-full" action={handleSubscription}>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your e-mail"
            className="caption1 h-full w-full rounded-xl border border-line pl-4 pr-14"
            required
          />
          <button
            className="absolute right-1 top-1 flex h-[44px] w-[44px] items-center justify-center rounded-xl bg-black"
            type="submit"
          >
            <Icon.ArrowRight size={24} color="#fff" />
          </button>
        </form>
      </div>
      {isModalVisible && (
        <div className={`newsletter-popup ${isModalVisible ? 'open' : ''}`}>
          <div className="newsletter-popup-content rounded-lg bg-white p-8 shadow-md">
            <p className="capitalize text-gray-700">
              {isSubscribed
                ? "You're now subscribed to our newsletter. Get ready for exclusive offers and updates!"
                : message}
            </p>
            <button
              type="button"
              className="mt-4 w-full justify-center rounded-lg bg-black px-4 py-2 text-white"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterSubscription;
