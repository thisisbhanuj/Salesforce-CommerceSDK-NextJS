"use server";

import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

async function getAccessTokenFromKV(user: string) {
  try {
    const accessToken = await kv.hget(`tokens:${user}`, "accessToken");
    return NextResponse.json(accessToken);
  } catch (error) {
    console.error("Error fetching access token:", error);
    return NextResponse.json(
      { error: "Failed to fetch access token" },
      { status: 500 },
    );
  }
}

async function getTokensFromKV(user: string) {
  try {
    const tokens = await kv.hgetall(`tokens:${user}`);
    return NextResponse.json(tokens);
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return NextResponse.json(
      { error: "Failed to fetch tokens" },
      { status: 500 },
    );
  }
}

async function setTokensInKV({
  accessToken,
  refreshToken,
  user,
}: {
  accessToken: string;
  refreshToken: string;
  user: string;
}) {
  try {
    await kv.hset(`tokens:${user}`, {
      accessToken,
      refreshToken,
      user,
    });
    return NextResponse.json({ message: "Tokens Set" });
  } catch (error) {
    console.error("Error setting tokens:", error);
    return NextResponse.json(
      { error: "Failed to set tokens" },
      { status: 500 },
    );
  }
}

export { getAccessTokenFromKV, getTokensFromKV, setTokensInKV };
