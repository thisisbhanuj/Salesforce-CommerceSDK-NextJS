"use server";

import { kv } from "@vercel/kv";
import { RedisSessionKVConfig } from "@repo/types-config/CommonTypes";

export async function getAccessTokenFromKV(sessionId: string) {
  try {
    const accessToken = await kv.hget(sessionId, "access_token");
    return accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw new Error("Failed to fetch access token");
  }
}

export async function setUserSessionInKV(data: RedisSessionKVConfig) {
  try {
    if (!data.sessionId) {
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

export async function deleteSessionFromKV(sessionId: string) {
  try {
    await kv.del(sessionId);
  } catch (error) {
    console.error("Error deleting session:", error);
    throw new Error("Failed to delete session");
  }
}
