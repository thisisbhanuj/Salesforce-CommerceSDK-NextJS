import { GuestAccessTokenResponse } from '@repo/types-config/CommonTypes';

export const shopperGuestAccessToken = async () => {
  try {
    const tokenResponse = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/scapi/shopper/authnz/guest`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!tokenResponse.ok) {
      console.debug(
        'GuestAccessTokenResponse : ',
        tokenResponse.statusText,
        tokenResponse.status,
      );
      throw new Error('Failed to fetch access token');
    }

    const session: GuestAccessTokenResponse = await tokenResponse.json();
    console.debug('session', session);

    return session;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching access token: ${error.message}`);
    } else {
      throw new Error('Unexpected error while fetching access token');
    }
  }
};
