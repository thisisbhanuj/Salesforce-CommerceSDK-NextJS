"use server";

import { helpers, ShopperLogin } from "commerce-sdk-isomorphic";
import {
  AuthHeaderConfigurations,
  ShopperLoginParameters,
  TokenResponse,
} from "@repo/types-config/CommonTypes";
import { setUserSessionInVercelKV } from "../nodejs-runtime/kvSDKService";
import { createSessionId } from "@/utility/kvUtils";
import PrivateClientConfigSingleton from "@/clients/PrivateClientConfigSingleton";

/**
 * Fetch an access token for Guest User.
 *
 * To effectively handle the SCAPI request and bypass CORS restrictions,
 * we created a serverless function in Next.js. That function will act as a proxy,
 * forwarding request to SCAPI endpoint & returning the response to the client.
 *
 * @returns The access token and session id.
 * @throws Error if the login fails.
 */
export async function fetchGuestAccessToken() {
  try {
    // Serverless function will act as reverse proxy to SCAPI endpoint
    const tokenResponse = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/authnz/guest`,
    );
    return tokenResponse.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching access token: ${error.message}`);
    } else {
      throw new Error("Unexpected error while fetching access token");
    }
  }
}

/**
 * Fetch an access token for Registered User.
 *
 * @param username - The username.
 * @param password - The password.
 * @returns The access token.
 * @throws Error if the login fails.
 */
export async function fetchRegisteredAccessToken(
  username: string,
  password: string,
) {
  try {
    const clientConfigInstance = PrivateClientConfigSingleton.getInstance();
    const tokenResponse: TokenResponse = await helpers.loginRegisteredUserB2C(
      new ShopperLogin<ShopperLoginParameters>(
        clientConfigInstance.getClientConfig(),
      ),
      {
        username: username,
        password: password,
        clientSecret: clientConfigInstance.getClientSecret(),
      },
      {
        redirectURI: "testuser",
        usid: "testuser",
      },
    );

    if (!tokenResponse.access_token) {
      throw new Error("Failed to fetch access token");
    }

    await setUserSessionInVercelKV({
      sessionId: createSessionId(),
      access_token: tokenResponse.access_token,
      refresh_token: tokenResponse.refresh_token,
      customer_id: tokenResponse.customer_id,
      usid: tokenResponse.usid,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching access token: ${error.message}`);
    } else {
      throw new Error("Unexpected error while fetching access token");
    }
  }
}

/**
 * Generate an authorization header for customers.
 * @param authConfig - The authentication configuration.
 * @param isGuest - Whether the user is a guest.
 * @returns The authorization header.
 * @throws Error if the header generation fails.
 */
export async function generateAuthHeader(
  authConfig: AuthHeaderConfigurations,
  isGuest: boolean,
): Promise<string> {
  try {
    const credentials = isGuest
      ? `${authConfig.guest?.clientId}:${authConfig.guest?.clientSecret}`
      : `${authConfig.shopper?.username}:${authConfig.shopper?.password}`;
    const encodedCredentials = Buffer.from(credentials).toString("base64");
    return `Basic ${encodedCredentials}`;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error generating auth header: ${error.message}`);
    } else {
      throw new Error("Unexpected error while generating auth header");
    }
  }
}
