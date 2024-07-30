'use client';

import { useEffect, useState, useRef } from 'react';
import { shopperGuestAccessToken } from '../sfcc/orchestration/SCAPIShopper';
import { ShopperSessionSCAPI } from '@repo/types-config/CommonTypes';

export const useSCAPISession = () => {
  const [sessionData, setSessionData] = useState<ShopperSessionSCAPI | null>(
    null,
  );

  /**
   * Using useRef can help prevent certain code within a useEffect from running multiple times
   * by tracking whether the effect has already been run. This is especially useful in development
   * with React's Strict Mode, where effects might be run twice for the purposes of highlighting side effects.
   *
   * Here's how useRef helps in detail:
   * useRef is a hook that allows you to persist values across renders without causing re-renders when the value changes.
   * It returns a mutable ref object whose .current property can be set to any value.
   * Unlike state, updating a ref does not trigger a re-render.
   */
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      const fetchSessionData = async () => {
        let sfccSessionData: ShopperSessionSCAPI | null = null;
        const storedSessionData = sessionStorage.getItem('sfccSessionData');

        if (storedSessionData) {
          sfccSessionData = JSON.parse(storedSessionData);
        } else {
          sfccSessionData = await shopperGuestAccessToken();
          sessionStorage.setItem(
            'sfccSessionData',
            JSON.stringify(sfccSessionData),
          );
        }

        if (sfccSessionData) {
          setSessionData(sfccSessionData);
          document.cookie = `sfccSessionData=${JSON.stringify(sfccSessionData)}; path=/;`;
        }
      };

      fetchSessionData();
      effectRan.current = true;
    }
  }, []);

  return sessionData;
};
