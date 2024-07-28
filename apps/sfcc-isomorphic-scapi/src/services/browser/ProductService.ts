"use server";

/**
 * Search for product details using the ShopperProducts API.
 * @param productId - Product ID.
 * @param sessionId - The session ID.
 * @returns The product details.
 * @throws Error if the search fails.
 */
export async function productDetails(
  productId: string,
  sessionId: string,
): Promise<Record<string, unknown>> {
  try {
    // Serverless function will act as reverse proxy to SCAPI endpoint
    const productDetailsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/product/${productId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          sessionId: `${sessionId ?? ""}`,
        },
      },
    );
    const productDetailsObj = await productDetailsResponse.json();
    return productDetailsObj.productModel;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error searching product: ${error.message}`);
    } else {
      throw new Error("Unexpected error while searching product");
    }
  }
}
