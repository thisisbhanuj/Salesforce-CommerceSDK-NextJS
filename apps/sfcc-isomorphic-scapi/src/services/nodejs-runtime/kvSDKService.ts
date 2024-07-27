"use server";

import { kv } from "@vercel/kv";
import { RedisSessionKVConfig } from "@repo/types-config/CommonTypes";

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

export async function getUserSessionFromVercelKV(sessionId: string) {
  try {
    const sessionKV = await kv.hgetall(sessionId);
    return sessionKV;
  } catch (error) {
    console.error("Error fetching session:", error);
    throw new Error("Failed to fetch session");
  }
}

export async function getAccessTokenFromVercelKV(sessionId: string) {
  try {
    const accessToken = await kv.hget(sessionId, "access_token");
    return accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw new Error("Failed to fetch access token");
  }
}

export async function deleteSessionFromVercelKV(sessionId: string) {
  try {
    await kv.del(sessionId);
  } catch (error) {
    console.error("Error deleting session:", error);
    throw new Error("Failed to delete session");
  }
}
