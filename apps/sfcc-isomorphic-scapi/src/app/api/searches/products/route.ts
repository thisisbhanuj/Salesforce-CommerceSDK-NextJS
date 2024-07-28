"use server";

import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { ShopperSearch } from "commerce-sdk-isomorphic";

import PrivateClientConfigSingleton from "@/clients/PrivateClientConfigSingleton";
import { getAccessTokenFromVercelKV } from "@/services/nodejs-runtime/kvSDKService";

/**
 * Get products search using the ShopperSearch API.
 * @param request - The incoming request.
 * @returns Search results.
 * @throws Error if the search fails.
 */
export async function GET(request: NextRequest) {
  const searchQuery = request.nextUrl.searchParams.get("query");
  if (!searchQuery) {
    return NextResponse.json(
      { error: "Missing search query" },
      { status: HttpStatusCode.BadRequest },
    );
  }

  const clientConfigInstance = PrivateClientConfigSingleton.getInstance();
  const clientConfig = clientConfigInstance.getClientConfig();

  let accessToken = undefined;

  const sessionId = request.headers.get("sessionId");
  if (sessionId) {
    console.debug("Session ID from request headers: ", sessionId);
    // Fetch access token from Vercel KV
    accessToken = await getAccessTokenFromVercelKV(sessionId);
  } else {
    console.error("Session ID is not present in the request");
    return NextResponse.json("Unauthorized", {
      status: HttpStatusCode.Unauthorized,
    });
  }

  if (!accessToken) {
    console.error("Access token not found");
    return NextResponse.json("Unauthorized", {
      status: HttpStatusCode.Unauthorized,
    });
  }

  try {
    // Create ShopperSearch instance
    const shopperSearch = new ShopperSearch({
      ...clientConfig,
      headers: { authorization: `Bearer ${accessToken}` },
    });
    // Search for products
    const searchResult = await shopperSearch.productSearch({
      parameters: { q: searchQuery },
    });

    if (!shopperSearch) {
      console.error(`Products not found for search query : ${searchQuery}`);
      return NextResponse.json("Products not found", {
        status: HttpStatusCode.NotFound,
      });
    }

    const searchModel = {
      total: searchResult.total,
      products: searchResult.hits.map((product) => {
        return {
          id: product.productId,
          name: product.productName,
          price: product.price,
          currency: product.currency,
          image: product.image,
          imageGroups: product.imageGroups,
          priceRanges: product.priceRanges,
        };
      }),
      offset: searchResult.offset,
      limit: searchResult.limit,
    };

    console.debug("Search Model: ", searchModel);

    return NextResponse.json(
      { searchModel: searchModel },
      { status: HttpStatusCode.Ok },
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching access token: ${error.message}`);
    } else {
      throw new Error("Unexpected error while fetching access token");
    }
  }
}
