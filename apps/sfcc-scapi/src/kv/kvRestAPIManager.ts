"use server";
import { RedisSessionKVConfig } from "@repo/types-config/CommonTypes";
import { handleApiError } from "../helpers/errorHelpers";
import { genericApiRequest } from "../scapi/APIMgr";

interface KVResponse {
  result: string;
}

/**
 * Sets a user session in the KV store.
 *
 * @param userSessionData The user session data.
 * @returns A Promise that resolves when the session is set successfully.
 * @throws An error if the operation fails.
 */
export async function setUserSessionInVercelKV(
  userSessionData: RedisSessionKVConfig,
) {
  try {
    if (!userSessionData.sessionId) {
      throw new Error("setUserSessionInVercelKV : Missing sessionId");
    }

    const response = await genericApiRequest<any>(
      `${process.env.KV_REST_API_URL}/set/${userSessionData.sessionId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
        body: JSON.stringify(userSessionData),
      },
    );

    if (!response) {
      throw new Error(`setUserSessionInVercelKV : Failed to set KV`);
    }
    console.info("setUserSessionInVercelKV : ", response);

    return response;
  } catch (error) {
    if (error instanceof Error) {
      handleApiError(error, "userSession");
    }
    throw error;
  }
}

/**
 * Gets a user session from the KV store.
 *
 * @param sessionId The session ID.
 * @returns The user session data.
 * @throws An error if the operation fails.
 */
export async function getUserSessionFormVercelKV(
  sessionId: string,
): Promise<RedisSessionKVConfig> {
  try {
    const response: KVResponse = await genericApiRequest<any>(
      `${process.env.KV_REST_API_URL}/get/${sessionId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
      },
    );

    const sessionKV: RedisSessionKVConfig = JSON.parse(response.result);
    console.debug("getUserSessionFormVercelKV : ", sessionKV);

    return sessionKV;
  } catch (error) {
    if (error instanceof Error) {
      await handleApiError(error, "userSession");
    }
    throw error;
  }
}
