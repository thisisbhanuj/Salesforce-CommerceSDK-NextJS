"use server";

import { ClientConfig } from "@/types/SCAPIType";
import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

/**
 * Fetch product details using the Products SCAPI.
 * @param accessToken - The access token.
 * @param params - The product ID.
 * @param clientConfig - The client configuration.
 * @returns The product details.
 */
export async function fetchProductSCAPI(
  accessToken: string,
  params: { productId: string },
  clientConfig: ClientConfig,
) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(
    `${clientConfig.baseUrl}/product/shopper-products/${clientConfig.shopperApiVersion}/organizations/${clientConfig.parameters.organizationId}/products/${params.productId}/?siteId=${clientConfig.parameters.siteId}`,
    {
      method: "GET",
      headers,
    },
  );

  if (!response.ok) {
    console.error(`Failed to fetch product: ${response.statusText}`);
    return NextResponse.json("Failed to fetch product", {
      status: HttpStatusCode.InternalServerError,
    });
  }

  const productJSON = await response.json();

  if (!productJSON) {
    console.error(`Product not found: ${params.productId}`);
    return NextResponse.json("Product not found", {
      status: HttpStatusCode.NotFound,
    });
  }

  return productJSON;
}
