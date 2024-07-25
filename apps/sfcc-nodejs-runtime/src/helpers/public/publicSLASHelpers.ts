"use server";
/**
 * Examples on how to use the SLAS helpers using a public client:
 *  - Get authorization token for a guest user
 *  - Get authorization token for a registered user
 *  - Get a new authorization token using refresh token
 *  - Logout
 * For more information, see (Shopper Login and API Access Service)
 * [https://developer.salesforce.com/docs/commerce/commerce-api/guide/slas-public-client.html].
 */

import { ClientConfig, Customer, slasHelpers } from "commerce-sdk";

const CLIENT_ID = process.env.SLAS_PRIVATE_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.SLAS_CLIENT_SECRET ?? "";
const ORG_ID = process.env.COMMERCE_CLIENT_ORG_ID ?? "";
const SHORT_CODE = process.env.COMMERCE_CLIENT_SHORT_CODE ?? "";
const SITE_ID = process.env.SITE_ID ?? "";
const redirectURI = process.env.SLAS_REDIRECT_URI ?? "";

const clientConfig: ClientConfig = {
  parameters: {
    clientId: CLIENT_ID,
    organizationId: ORG_ID,
    shortCode: SHORT_CODE,
    siteId: SITE_ID,
  },
};

const slasClient = new Customer.ShopperLogin(clientConfig);

/**
 * Get the guest JWT/access token along with a refresh token,
 * using client credentials
 *
 * @returns guest user authorization token
 */
export async function getGuestUserAuthToken(): Promise<Customer.ShopperLogin.TokenResponse> {
  const credentials = CLIENT_ID + ":" + CLIENT_SECRET;
  const base64data = Buffer.from(credentials).toString("base64");
  const headers = { Authorization: `Basic ${base64data}` };

  return await slasClient.getAccessToken({
    headers,
    body: {
      grant_type: "client_credentials",
    },
  });
}

export async function loginGuestUser(): Promise<Customer.ShopperLogin.TokenResponse> {
  let guestTokenResponse: any = null;
  try {
    guestTokenResponse = await slasHelpers.loginGuestUser(slasClient, {
      redirectURI: redirectURI,
    });
    if (!guestTokenResponse) {
      throw new Error("Failed to get guest token");
    }
  } catch (error) {
    console.log("Error fetching token for guest login: ", error);
  }

  return guestTokenResponse;
}

export async function loginRegisteredUser(shopper: {
  username: string;
  password: string;
}): Promise<Customer.ShopperLogin.TokenResponse> {
  let registeredUserTokenResponse: any = null;
  try {
    registeredUserTokenResponse = await slasHelpers.loginRegisteredUserB2C(
      slasClient,
      {
        username: shopper.username,
        password: shopper.password,
      },
      { redirectURI },
    );
    if (!registeredUserTokenResponse) {
      throw new Error("Failed to get registered user token");
    }
  } catch (error) {
    console.log("Error fetching token for registered user login: ", error);
  }

  return registeredUserTokenResponse;
}

/**
 * Get a new auth token using refresh token
 *
 * @param refreshToken - Valid refresh token
 * @returns New token with updated expiry time
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<Customer.ShopperLogin.TokenResponse> {
  let refreshTokenResponse: any = null;
  try {
    refreshTokenResponse = await slasHelpers.refreshAccessToken(slasClient, {
      refreshToken,
    });
    if (!refreshTokenResponse) {
      throw new Error("Failed to get refresh token");
    }
  } catch (error) {
    console.log("Error refreshing token: ", error);
  }

  return refreshTokenResponse;
}

export async function logout(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  try {
    await slasHelpers.logout(slasClient, {
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log("Error logging out: ", error);
  }
}
