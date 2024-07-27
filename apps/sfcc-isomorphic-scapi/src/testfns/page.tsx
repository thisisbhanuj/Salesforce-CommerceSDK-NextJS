"use client";

import { useState } from "react";
import { fetchGuestAccessToken } from "@/services/browser/AuthService";

export default function TestPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleGuestLogin = async () => {
    try {
      const response = await fetchGuestAccessToken();
      if (response?.accessToken) {
        setAccessToken(response.accessToken);
      }
    } catch (error) {
      console.error("Error fetching guest access token:", error);
    }
  };

  return (
    <>
      <h1>Test Functionalities Page</h1>
      <p>Page to test function calls</p>
      <button onClick={handleGuestLogin}>Guest Login</button>
      {accessToken && <p className="text-wrap">Access Token: {accessToken}</p>}
    </>
  );
}
