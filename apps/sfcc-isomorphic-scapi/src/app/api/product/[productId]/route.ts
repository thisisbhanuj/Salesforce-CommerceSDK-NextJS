"use server";

import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { ShopperProducts } from "commerce-sdk-isomorphic";

import PrivateClientConfigSingleton from "../../../../clients/PrivateClientConfigSingleton";
import { getAccessTokenFromVercelKV } from "../../../../services/nodejs-runtime/kvSDKService";

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
  const clientConfigInstance = PrivateClientConfigSingleton.getInstance();
  const clientConfig = clientConfigInstance.getClientConfig();

  let accessToken = undefined;

  const sessionId = request.headers.get("SESSION_ID");

  if (sessionId) {
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
    const shopperProductsClient = new ShopperProducts({
      ...clientConfig,
      headers: { authorization: `Bearer ${accessToken}` },
    });

    const product = await shopperProductsClient.getProduct({
      parameters: {
        id: params.productId,
      },
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    if (!product) {
      console.error(`Product not found: ${params.productId}`);
      return NextResponse.json("Product not found", {
        status: HttpStatusCode.NotFound,
      });
    }

    const productModel = {
      id: product.id,
      type: product.type,
      master: product.master,
      name: product.name,
      variants: product?.variants?.map((variant) => ({
        id: variant.productId,
        variationValues: variant.variationValues,
        price: variant.price,
      })),
      variationAttributes: product.variationAttributes,
      shortDescription: product.shortDescription,
      longDescription: product.longDescription,
      primaryCategoryId: product.primaryCategoryId,
      imageGroups: product.imageGroups,
      inventory: product.inventory,
    };

    return NextResponse.json(
      { productModel: productModel },
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
