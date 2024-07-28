"use server";
import { RedisSessionKVConfig } from "@repo/types-config/CommonTypes";
import { handleApiError } from "@/helpers/errorHelpers";
import { genericApiRequest } from "@/scapi/APIMgr";

const KV_REST_API_URL = process.env.KV_REST_API_URL!;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN!;

/**
 * Sets a user session in the KV store.
 *
 * @param userSessionData The user session data.
 * @returns A Promise that resolves when the session is set successfully.
 * @throws An error if the operation fails.
 */
export async function setUserSession(userSessionData: RedisSessionKVConfig) {
  try {
    if (!userSessionData.sessionId) {
      throw new Error("Missing sessionId");
    }

    const response = await genericApiRequest<RedisSessionKVConfig>(
      `${KV_REST_API_URL}/set/${userSessionData.sessionId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${KV_REST_API_TOKEN}`,
        },
        body: JSON.stringify(userSessionData),
      },
    );
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
export async function getUserSession(
  sessionId: string,
): Promise<RedisSessionKVConfig> {
  try {
    const response = await genericApiRequest<RedisSessionKVConfig>(
      `${KV_REST_API_URL}/get/${sessionId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${KV_REST_API_TOKEN}`,
        },
      },
    );
    return response;
  } catch (error) {
    if (error instanceof Error) {
      handleApiError(error, "userSession");
    }
    throw error;
  }
}
