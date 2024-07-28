"use server";

import { getUserSessionFormVercelKV } from "@/kv/kvRestAPIManager";
import { ClientConfig } from "@/types/SCAPIType";

export async function generateAuthHeader(
  clientConfig: ClientConfig,
  isGuest: boolean,
): Promise<string> {
  const guestTokenObject: any = isGuest
    ? Buffer.from(
        `${clientConfig.parameters.clientId}:${clientConfig.parameters.secret}`,
      ).toString("base64")
    : Buffer.from(
        `${clientConfig.shopper?.username}:${clientConfig.shopper?.password}`,
      ).toString("base64");
  return `Basic ${guestTokenObject.access_token}`;
}

export async function findAccessTokenInRedisKV(
  sessionId: string,
): Promise<string | undefined> {
  const userSession = await getUserSessionFormVercelKV(sessionId);

  if (!userSession) {
    throw new Error("User session not found");
  }

  return userSession.access_token;
}
