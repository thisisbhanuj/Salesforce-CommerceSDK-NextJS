"use server";
/**
 * Search for products using the ShopperSearch API.
 * @param query - The search query.
 * @param sessionId - The session ID.
 * @returns The search result.
 * @throws Error if the search fails.
 */
export async function searchProducts(
  query: string,
  sessionId: string,
): Promise<Record<string, unknown>> {
  try {
    // Serverless function will act as reverse proxy to SCAPI endpoint
    const searchResponse = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/searches/products?query=${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          sessionId: `${sessionId ?? ""}`,
        },
      },
    );
    // Parse the response
    const srarchObj = await searchResponse.json();
    // Return the search model
    return srarchObj.searchModel;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error searching products: ${error.message}`);
    } else {
      throw new Error("Unexpected error while searching products");
    }
  }
}
