'use server';

import { NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';

import PrivateClientConfigSingleton from '@repo/sfcc-scapi/src/clients/PrivateClientConfigSingleton';
import { generateAuthHeader } from '@repo/sfcc-scapi/src/helpers/authHelper';
import { createSessionId } from '@repo/sfcc-scapi/src/kv/kvUtils';
import { setUserSessionInVercelKV } from '@repo/sfcc-scapi/src/kv/kvRestAPIManager';
import { ClientConfig } from '@repo/sfcc-scapi/src/types/SCAPIType';

/**
 * Serverless Function to get access token for guest user using the client credentials grant type.
 * @returns The access token.
 * @throws Error if the access token is missing.
 */
export async function POST() {
  try {
    const clientConfigInstance = PrivateClientConfigSingleton.getInstance(
      process.env.SITE_ID!,
    ).getClientConfig();

    const url = `${clientConfigInstance.baseUrl}/shopper/auth/${clientConfigInstance.shopperApiVersion}/organizations/${clientConfigInstance.parameters.organizationId}/oauth2/token`;

    const { requestContext: requestOptions } =
      await setupGuestAccessTokenRequestContext(url, clientConfigInstance);

    const tokenResponse = await fetch(url, {
      ...requestOptions,
      redirect: 'follow',
      cache: 'no-cache',
    });

    const tokenResponseText = await tokenResponse.text();
    if (tokenResponse.status !== HttpStatusCode.Ok) {
      return NextResponse.json(
        `Error fetching access token: ${tokenResponseText}`,
        {
          status: tokenResponse.status,
        },
      );
    }

    const tokenResponseJSON = JSON.parse(tokenResponseText);
    console.debug('tokenResponseJSON:', tokenResponseJSON);
    if (!tokenResponseJSON?.access_token) {
      return NextResponse.json(
        {
          message: 'Failed to fetch access token from tokenResponseJSON',
        },
        { status: HttpStatusCode.InternalServerError },
      );
    }

    const sessionId = createSessionId();

    await setUserSessionInVercelKV({
      sessionId,
      access_token: tokenResponseJSON.access_token,
      refresh_token: tokenResponseJSON.refresh_token,
      usid: tokenResponseJSON.usid,
      customer_id: tokenResponseJSON.customer_id,
    });

    return NextResponse.json(
      {
        accessToken: tokenResponseJSON.access_token,
        sessionId: sessionId,
        refreshToken: tokenResponseJSON.refresh_token,
        usid: tokenResponseJSON.usid,
      },
      { status: HttpStatusCode.Ok },
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching access token: ${error.message}`);
    } else {
      throw new Error('Unexpected error while fetching access token');
    }
  }
}

/**
 * Set up the request context for fetching the access token for the guest user.
 * @param url The URL to fetch the access token.
 * @param clientConfigInstance The client configuration instance.
 * @returns The request context.
 */
async function setupGuestAccessTokenRequestContext(
  url: string,
  clientConfigInstance: ClientConfig,
) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append(
    'Authorization',
    await generateAuthHeader(clientConfigInstance, true),
  );

  const urlencoded = new URLSearchParams();
  urlencoded.append('grant_type', 'client_credentials');
  urlencoded.append('redirect_uri', clientConfigInstance.redirectUri);

  const requestContext = {
    method: 'POST',
    headers: headers,
    body: urlencoded,
  };

  console.debug('**********************************************************');
  console.debug('Request URL:', url);
  console.debug('Request Headers:', JSON.stringify([...headers]));
  console.debug('Request Body:', urlencoded.toString());
  console.debug('**********************************************************');

  return { requestContext };
}
