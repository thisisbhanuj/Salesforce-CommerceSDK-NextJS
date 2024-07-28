"use server";

import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import PrivateClientConfigSingleton from "@/clients/PrivateClientConfigSingleton";
import { convertJSONToModel } from "@/helpers/productHelper";
import { fetchProductSCAPI } from "@/scapi/shopper/ProductService";
import { findAccessTokenInRedisKV } from "@/helpers/authHelper";
import { getSessionIDfromRequest } from "@/helpers/requestHelper";

/**
 * Get product details using the ShopperProducts API.
 * @param params - The product ID.
 * @returns The product details.
 * @throws Error if the product details are missing.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } },
) {
  const clientConfig = PrivateClientConfigSingleton.getInstance(
    process.env.SITE_ID!,
  ).getClientConfig();

  const sessionId = await getSessionIDfromRequest(request);
  if (!sessionId) {
    return NextResponse.json(
      { error: "Missing session ID" },
      { status: HttpStatusCode.BadRequest },
    );
  }
  const accessToken = await findAccessTokenInRedisKV(sessionId);
  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token not found" },
      { status: HttpStatusCode.Unauthorized },
    );
  }

  try {
    const productJSON = await fetchProductSCAPI(
      accessToken,
      params,
      clientConfig,
    );
    if (productJSON) {
      const productModel = convertJSONToModel(productJSON);
      return NextResponse.json(
        { productModel: productModel },
        { status: HttpStatusCode.Ok },
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching access token: ${error.message}`);
    } else {
      throw new Error("Unexpected error while fetching access token");
    }
  }
}
