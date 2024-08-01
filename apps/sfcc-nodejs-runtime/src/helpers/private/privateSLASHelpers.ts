"use server";
/**
 * SLAS helpers using a private client:
 *  - Get authorization token for a guest user
 *  - Get authorization token for a registered user
 *  - Get a new auth token using refresh token
 * For more information, see (Shopper Login and API Access Service)
 * [https://developer.salesforce.com/docs/commerce/commerce-api/guide/slas-private-client.html]
 */

import { Customer, slasHelpers } from "commerce-sdk";
import {
  getObjectFromResponse,
  ResponseError,
  ShopperToken,
  stripBearer,
} from "@commerce-apps/core";
import PrivateClientConfigSingleton from "../../clients/PrivateClientConfigSingleton";
import { ShopperTokenResponse } from "@repo/types-config/CommonTypes";

/**
 * Get the shopper or guest JWT access token and a refresh token. 
 * This is the second step of the OAuth 2.1 authorization code flow.
 * 
 * For a private client, an application is able to get an access token
 * for the shopper through the back channel (a trusted server) 
 * by passing in the client credentials and the authorization code 
 * retrieved from the `authorize` endpoint.
 * 
 * For a guest user, get the shopper JWT access token and a refresh token. 
 * This is where a client appplication is able to get an access token for 
 * the guest user through the back channel (a trusted server) 
 * by passing in the client credentials.
 *
 * @returns guest user authorization token
 */
export async function getGuestUserAuthToken(): Promise<ShopperTokenResponse | void> {
  const clientInstance = await PrivateClientConfigSingleton.getInstance();
  const slasClient = new Customer.ShopperLogin(clientInstance.getClientConfig());

  try{
    const guestAuthTokenResponse: ShopperTokenResponse = await slasClient.getAccessToken({
      headers: {
        "Authorization": clientInstance.getBasicAuthHeaderForGuest(),
      },
      body: {
        grant_type: "client_credentials",
        channel_id: clientInstance.getChannelId(),
      },
      fetchOptions: {
        headers: {
          "Content-Type": "application/json",
        },
      },
    });

    if (!guestAuthTokenResponse) {
      throw new Error("getGuestUserAuthToken: Failed to get guest token");
    }

    return guestAuthTokenResponse;

  } catch (error) {
    console.log("getGuestUserAuthToken: Error fetching token for guest login: ", error);
    throw new Error("getGuestUserAuthToken : Failed to get guest token");
  }
}

/**
 * Get an authorization code after authenticating a user against an identity provider (IDP). 
 * This is the first step of the OAuth 2.1 authorization code flow,
 * where a user can log in via federation to the IDP configured for the client. 
 * After successfully logging in, the user gets an authorization code via a redirect URI.
 * 
 * This endpoint can be called from the front channel (the browser)
 *
 * @returns authorization token
 */
export async function getRegisteredShopperTokenFromIDP(shopper: {
  username: string;
  password: string;
}): Promise<ShopperToken<Customer.ShopperCustomers.Customer>> {
  const credentials = `${shopper.username}:${shopper.password}`;
  const buff = Buffer.from(credentials);
  const base64data = buff.toString("base64");
  const headers = { Authorization: `Basic ${base64data}` };

  const clientInstance = await PrivateClientConfigSingleton.getInstance();
  const slasClient = new Customer.ShopperLogin(clientInstance.getClientConfig());

  const response = await slasClient.authorizeCustomer(
    {
      headers: headers,
      fetchOptions: {
        headers: {
          "Content-Type": "application/json",
        },
      },
    },
    true,
  );
  if (!response.ok) {
    throw new ResponseError(response);
  }
  const customerInfo: Customer.ShopperCustomers.Customer =
    await getObjectFromResponse(response);

  return new ShopperToken(
    customerInfo,
    stripBearer(response.headers.get("Authorization")),
  );
}

/**
 * A single function to execute the ShopperLogin Private Client Guest Login
 *
 * @returns Response from the server
 */
export async function loginGuestUser(): Promise<ShopperTokenResponse | void> {
  const clientInstance = await PrivateClientConfigSingleton.getInstance();
  const slasClient = new Customer.ShopperLogin(clientInstance.getClientConfig());

  let guestTokenResponse: ShopperTokenResponse;
  try {
    guestTokenResponse = await slasHelpers.loginGuestUserPrivate(slasClient, {
      clientSecret: clientInstance.getClientSecret(),
    });
    if (!guestTokenResponse) {
      throw new Error("loginGuestUser: Failed to get guest token");
    }

    return guestTokenResponse;
  } catch (error) {
    console.log("loginGuestUser : Error fetching token for guest login: ", error);
    throw new Error("loginGuestUser : Failed to get guest token");
  }
}

/**
 * Login the registered user
 * @param shopper - Shopper details
 *
 * @returns Response from the server
 */
export async function loginRegisteredUser(shopper: {
  username: string;
  password: string;
}): Promise<ShopperTokenResponse | void> {
  const clientInstance = await PrivateClientConfigSingleton.getInstance();
  const slasClient = new Customer.ShopperLogin(clientInstance.getClientConfig());

  let registeredUserTokenResponse: ShopperTokenResponse;
  try {
    registeredUserTokenResponse =
      await slasHelpers.loginRegisteredUserB2Cprivate(
        slasClient,
        {
          username: shopper.username,
          password: shopper.password,
          clientSecret: clientInstance.getClientSecret(),
        },
        { redirectURI: clientInstance.getRedirectUri() },
      );
    if (!registeredUserTokenResponse) {
      throw new Error("loginRegisteredUser : Failed to get registered user token");
    }
    return registeredUserTokenResponse;
  } catch (error) {
    console.log("loginRegisteredUser : Error fetching token for registered user login: ", error);
    throw new Error("loginRegisteredUser : Failed to get registered user token");
  }
}

/**
 * Exchange a refresh token for a new access token
 *
 * @param refreshToken - Valid refresh token
 * @returns New token with updated expiry time
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<ShopperTokenResponse | void> {
  const clientInstance = await PrivateClientConfigSingleton.getInstance();
  const slasClient = new Customer.ShopperLogin(clientInstance.getClientConfig());

  let refreshTokenResponse: ShopperTokenResponse;
  try {
    refreshTokenResponse = await slasHelpers.refreshAccessTokenPrivate(
      slasClient,
      { clientSecret: clientInstance.getClientSecret() },
      { refreshToken },
    );
    if (!refreshTokenResponse) {
      throw new Error("refreshAccessToken : Failed to get refresh token");
    }
  
    return refreshTokenResponse;
  } catch (error) {
    console.log("refreshAccessToken : Error refreshing token: ", error);
  }
  
  return;
}

/**
 * Logout the user
 *
 * @param accessToken - Access token
 * @param refreshToken - Refresh token
 */
export async function logout(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  const clientInstance = await PrivateClientConfigSingleton.getInstance();
  const slasClient = new Customer.ShopperLogin(clientInstance.getClientConfig());

  try {
    await slasHelpers.logout(slasClient, {
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log("Error logging out: ", error);
    throw new Error("logout: Failed to logout");
  }
}
