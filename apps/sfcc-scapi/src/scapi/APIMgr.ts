"use server";

import { ApiRequestOptions } from "@repo/types-config/CommonTypes";

export async function genericApiRequest<T>(
  url: string,
  options?: ApiRequestOptions,
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Handle errors here, e.g., logging, custom error handling
    throw error;
  }
}
