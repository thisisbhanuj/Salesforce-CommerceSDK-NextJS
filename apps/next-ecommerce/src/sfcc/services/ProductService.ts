import { ClientConfig } from '@repo/sfcc-scapi/src/types/SCAPIType';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

/**
 * Fetch product details using the Products SCAPI.
 * @param accessToken - JWT Shopper Token.
 * @param productId - The product ID.
 * @param clientConfig - The client configuration.
 * @returns The product details.
 */
export async function fetchProductSCAPI(
  accessToken: string,
  productId: string,
  clientConfig: ClientConfig,
) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', `Bearer ${accessToken}`);
  console.debug('Request Headers:', headers);

  const url = `${clientConfig.baseUrl}/product/shopper-products/${clientConfig.shopperApiVersion}/organizations/${clientConfig.parameters.organizationId}/products/${productId}?siteId=${clientConfig.parameters.siteId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers,
    redirect: 'follow',
  });

  console.debug('Response Headers:', [...response.headers.entries()]);

  if (!response.ok) {
    console.error(
      `Failed to fetch product: ${response.status} - ${response.statusText}`,
    );
    return NextResponse.json('Failed to fetch product', {
      status: response.status,
    });
  }

  const responseBody = await response.json();
  console.debug('Product SCAPI Response: ', responseBody);

  if (!responseBody) {
    console.error(`Product not found: ${productId}`);
    return NextResponse.json('Product not found', {
      status: HttpStatusCode.NotFound,
    });
  }

  return responseBody;
}
