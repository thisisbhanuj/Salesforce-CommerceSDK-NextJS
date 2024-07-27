import { NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import PrivateClientConfigSingleton from "@/clients/PrivateClientConfigSingleton";
import { setUserSessionInVercelKV } from "@/services/nodejs-runtime/kvSDKService";
import { createSessionId } from "@/utility/kvUtils";
import {
  TokenResponse,
  ShopperLoginParameters,
} from "@repo/types-config/CommonTypes";
import { helpers, ShopperLogin } from "commerce-sdk-isomorphic";

export async function GET() {
  try {
    const clientConfigInstance = PrivateClientConfigSingleton.getInstance();
    const tokenResponse: TokenResponse = await helpers.loginGuestUserPrivate(
      new ShopperLogin<ShopperLoginParameters>(
        clientConfigInstance.getClientConfig(),
      ),
      { usid: undefined },
      { clientSecret: clientConfigInstance.getClientSecret() },
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

    return NextResponse.json(
      { accessToken: tokenResponse.access_token },
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
