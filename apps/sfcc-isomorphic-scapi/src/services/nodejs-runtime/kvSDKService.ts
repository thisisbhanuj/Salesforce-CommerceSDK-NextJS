"use server";

import { kv } from "@vercel/kv";
import { RedisSessionKVConfig } from "@repo/types-config/CommonTypes";

/**
 * Set user session in Vercel KV.
 * @param data - Session data.
 * @throws Error if the session data is missing.
 */
export async function setUserSessionInVercelKV(data: RedisSessionKVConfig) {
  try {
    if (!data.sessionId || typeof data.sessionId !== "string") {
      throw new Error("Missing sessionId");
    }
    await kv.hset(data.sessionId, {
      ...data,
    });
  } catch (error) {
    console.error("Error setting tokens:", error);
    throw new Error("Failed to set user session");
  }
}

/**
 * Get user session from Vercel KV.
 * @param sessionId - Session ID.
 * @returns The session data.
 * @throws Error if the session data is missing.
 */
export async function getUserSessionFromVercelKV(sessionId: string) {
  try {
    const sessionKV = await kv.hgetall(sessionId);
    return sessionKV;
  } catch (error) {
    console.error("Error fetching session:", error);
    throw new Error("Failed to fetch session");
  }
}

/**
 * Get access token from Vercel KV.
 * @param sessionId - Session ID.
 * @returns The access token.
 * @throws Error if the access token is missing.
 */
export async function getAccessTokenFromVercelKV(
  sessionId: string,
): Promise<unknown> {
  try {
    const accessToken = await kv.hget(sessionId, "access_token");
    return accessToken as string;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw new Error("Failed to fetch access token");
  }
}

/**
 * Delete user session from Vercel KV.
 * @param sessionId - Session ID.
 * @throws Error if the session deletion fails.
 */
export async function deleteSessionFromVercelKV(sessionId: string) {
  try {
    await kv.del(sessionId);
  } catch (error) {
    console.error("Error deleting session:", error);
    throw new Error("Failed to delete session");
  }
}
