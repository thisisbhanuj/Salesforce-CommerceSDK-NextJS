'use server'

import { SCAPIRestClient } from "@/clients/PrivateSCAPIClient";
import { ClientConfig } from "@/types/SCAPIType";

const CLIENT_ID = process.env.SLAS_PRIVATE_CLIENT_ID ?? '';
const CLIENT_SECRET = process.env.SLAS_CLIENT_SECRET ?? '';
const ORG_ID = process.env.COMMERCE_CLIENT_ORG_ID ?? '';
const SHORT_CODE = process.env.COMMERCE_CLIENT_SHORT_CODE ?? '';
const SITE_ID = process.env.SITE_ID ?? '';
const BASE_URL = process.env.SCAPI_BASE_URL ?? '';

export async function getGuestUserAuthToken(){
    const clientConfig: ClientConfig = {
        fetchToken: true,
        baseUrl: BASE_URL,
        parameters: {
          base64EncodedCredentials: Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
          clientId: CLIENT_ID,
          secret: CLIENT_SECRET,
          organizationId: ORG_ID,
          shortCode: SHORT_CODE,
          siteId: SITE_ID,
          channelId: 'GlobalRefArch'
        },
        redirectUri: process.env.SLAS_REDIRECT_URI ?? '',
    };
    
    const scapiClient = new SCAPIRestClient(clientConfig);
    const response = await scapiClient.fetchAuthTokenForGuest();
    return response;
}