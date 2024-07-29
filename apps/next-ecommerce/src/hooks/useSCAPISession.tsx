'use client';

import { useEffect, useState } from 'react';
import { shopperGuestAccessToken } from '../sfcc/orchestration/SCAPIShopper';
import { ShopperSessionSCAPI } from '@repo/types-config/CommonTypes';

export const useSCAPISession = () => {
  const [sessionData, setSessionData] = useState<ShopperSessionSCAPI | null>(
    null,
  );

  useEffect(() => {
    const fetchSessionData = async () => {
      let sfccSessionData: ShopperSessionSCAPI | null = null;
      const storedSessionData = localStorage.getItem('sfccSessionData');
      // Fetch and store the session data in the local storage
      if (storedSessionData) {
        sfccSessionData = JSON.parse(storedSessionData);
      } else {
        sfccSessionData = await shopperGuestAccessToken();
        localStorage.setItem(
          'sfccSessionData',
          JSON.stringify(sfccSessionData),
        );
      }
      // Store the session data in the cookie
      if (sfccSessionData) {
        setSessionData(sfccSessionData);
        document.cookie = `sfccSessionData=${JSON.stringify(sfccSessionData)}; path=/;`;
      }
    };

    fetchSessionData();
  }, []);

  return sessionData;
};
