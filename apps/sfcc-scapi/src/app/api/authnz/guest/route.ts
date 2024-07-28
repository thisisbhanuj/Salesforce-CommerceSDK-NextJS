"use server";

import { NextResponse } from "next/server";
import { HttpStatusCode } from "axios";

import PrivateClientConfigSingleton from "@/clients/PrivateClientConfigSingleton";
import { generateAuthHeader } from "@/helpers/authHelper";
import { createSessionId } from "@/kv/kvUtils";
import { setUserSessionInVercelKV } from "@/kv/kvRestAPIManager";

/**
 * Serverless Function to get access token for guest user using the client credentials grant type.
 * @returns The access token.
 * @throws Error if the access token is missing.
 */
export async function GET() {
  try {
    const clientConfigInstance = PrivateClientConfigSingleton.getInstance(
      process.env.SITE_ID!,
    ).getClientConfig();

    const headers = {
      Authorization: await generateAuthHeader(clientConfigInstance, true),
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");
    urlencoded.append("redirect_uri", clientConfigInstance.redirectUri);

    const tokenResponse = await fetch(
      `${clientConfigInstance.baseUrl}/shopper/auth/${clientConfigInstance.shopperApiVersion}/organizations/${clientConfigInstance.parameters.organizationId}/oauth2/token`,
      {
        method: "POST",
        headers,
        body: urlencoded,
        redirect: "follow",
      },
    );

    const tokenResponseJSON = await tokenResponse.json();

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
      throw new Error("Unexpected error while fetching access token");
    }
  }
}
