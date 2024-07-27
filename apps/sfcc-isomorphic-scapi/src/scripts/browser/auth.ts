import {
  ClientConfigInit,
  helpers,
  ShopperLogin,
} from "commerce-sdk-isomorphic";
import {
  AuthHeaderConfigurations,
  ShopperClientConfig,
  ShopperLoginParameters,
} from "@repo/types-config/CommonTypes";

const CLIENT_ID = process.env.SLAS_PRIVATE_CLIENT_ID!;
const CLIENT_SECRET = process.env.SLAS_CLIENT_SECRET!;
const ORG_ID = process.env.COMMERCE_CLIENT_ORG_ID!;
const SHORT_CODE = process.env.COMMERCE_CLIENT_SHORT_CODE!;
const SITE_ID = process.env.SITE_ID!;

export const clientConfig: ClientConfigInit<ShopperClientConfig> = {
  parameters: {
    clientId: CLIENT_ID,
    organizationId: ORG_ID,
    shortCode: SHORT_CODE,
    siteId: SITE_ID,
  },
};

/**
 * Fetch an access token for Guest User.
 * @returns The access token.
 * @throws Error if the login fails.
 */
export async function fetchGuestAccessToken() {
  try {
    const { access_token } = await helpers.loginGuestUserPrivate(
      new ShopperLogin<ShopperLoginParameters>(clientConfig),
      { usid: "guest" },
      { clientSecret: CLIENT_SECRET },
    );
    return access_token;
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
 * @returns The access token.
 * @throws Error if the login fails.
 */
export async function fetchRegisteredAccessToken() {
  try {
    const { access_token } = await helpers.loginRegisteredUserB2C(
      new ShopperLogin<ShopperLoginParameters>(clientConfig),
      {
        username: "testuser",
        password: "testpassword",
        clientSecret: CLIENT_SECRET,
      },
      {
        redirectURI: "testuser",
        usid: "testuser",
      },
    );
    return access_token;
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
