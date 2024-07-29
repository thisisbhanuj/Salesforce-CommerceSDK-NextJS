"use server";

import { ClientConfig } from "../../types/SCAPIType";
import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

/**
 * Fetch product details using the Products SCAPI.
 * @param accessToken - The access token.
 * @param params - The product ID.
 * @param clientConfig - The client configuration.
 * @returns Search Results.
 */
export async function fetchProductsSearchSCAPI(
  accessToken: string,
  params: { query: string },
  clientConfig: ClientConfig,
) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(
    `${clientConfig.baseUrl}/product/shopper-search/${clientConfig.shopperApiVersion}/organizations/${clientConfig.parameters.organizationId}/product-search/?siteId=${clientConfig.parameters.siteId}&q=${params.query}`,
    {
      method: "GET",
      headers,
    },
  );

  if (!response.ok) {
    console.error(`Failed to perfrom search query: ${response.statusText}`);
    return NextResponse.json("Failed to perform search", {
      status: HttpStatusCode.InternalServerError,
    });
  }

  const productJSON = await response.json();

  if (!productJSON) {
    console.error(`Search JSON could not be processed for : ${params.query}`);
    return NextResponse.json(
      `Search JSON could not be processed for : ${params.query}`,
      {
        status: HttpStatusCode.NotFound,
      },
    );
  }

  return productJSON;
}
