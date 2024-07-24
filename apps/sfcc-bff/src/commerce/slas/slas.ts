'use server'
/**
 * Get authorization token for a guest user
 */
import { ClientConfig, Customer } from "commerce-sdk";

const CLIENT_ID = process.env.SLAS_PRIVATE_CLIENT_ID ?? '';
const CLIENT_SECRET = process.env.SLAS_CLIENT_SECRET ?? '';
const ORG_ID = process.env.COMMERCE_CLIENT_ORG_ID ?? '';
const SHORT_CODE = process.env.COMMERCE_CLIENT_SHORT_CODE ?? '';
const SITE_ID = process.env.SITE_ID ?? '';

// client configuration parameters
const clientConfig: ClientConfig = {
  parameters: {
    clientId: CLIENT_ID,
    organizationId: ORG_ID,
    shortCode: SHORT_CODE,
    siteId: SITE_ID,
  },
};

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
  const client = new Customer.ShopperLogin(clientConfig);

  return await client.getAccessToken({
    headers,
    body: {
      grant_type: "client_credentials",
    },
  });
}
