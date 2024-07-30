import { GuestAccessTokenResponse } from '@repo/types-config/CommonTypes';

/**
 * Get a guest shopper token using the SLAS API.
 * @returns JWT Shopper Token.
 */
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

/**
 * Get product details using the ShopperProducts API.
 * @param productId - The product ID.
 * @param sessionId - The session ID.
 * @returns The product details JSON.
 */
export const shopperMasterProduct = async (
  productId: string,
  sessionId: string,
) => {
  try {
    if (!sessionId || !productId) {
      throw new Error('Missing session/product ID');
    }
    const productResponse = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/scapi/shopper/product/${productId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          SESSION_ID: sessionId,
        },
      },
    );

    if (!productResponse.ok) {
      console.error(
        'shopperMasterProduct : ',
        productResponse.statusText,
        productResponse.status,
      );
      throw new Error(`Failed to fetch Product: ${productId}`);
    }

    const productJSON = await productResponse.json();

    return productJSON;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching Product ${productId}: ${error.message}`);
    } else {
      throw new Error(`Unexpected error while fetching product ${productId}`);
    }
  }
};
