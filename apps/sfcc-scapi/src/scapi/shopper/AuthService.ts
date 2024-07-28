"use server";

/**
 * Get the guest user auth session data.
 */
export async function fetchGuestAccessToken() {
  try {
    // Serverless function will act as reverse proxy to SCAPI endpoint
    const tokenResponse = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/authnz/guest`,
    );
    return tokenResponse.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching access token: ${error.message}`);
    } else {
      throw new Error("Unexpected error while fetching access token");
    }
  }
}
