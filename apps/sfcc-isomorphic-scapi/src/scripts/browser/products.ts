import { ShopperSearch } from "commerce-sdk-isomorphic";
import {
  clientConfig,
  fetchGuestAccessToken,
  fetchRegisteredAccessToken,
} from "./auth";

/**
 * Search for products using the ShopperSearch API.
 * @param query - The search query.
 * @param isAutheticated - Whether the user is authenticated.
 * @returns The search result.
 * @throws Error if the search fails.
 */
async function searchProducts(query: string, isAutheticated: boolean) {
  try {
    const accessToken = isAutheticated
      ? await fetchRegisteredAccessToken()
      : await fetchGuestAccessToken();
    const shopperSearch = new ShopperSearch({
      ...clientConfig,
      headers: { authorization: `Bearer ${accessToken}` },
    });
    const searchResult = await shopperSearch.productSearch({
      parameters: { q: query },
    });
    return searchResult;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error searching products: ${error.message}`);
    } else {
      throw new Error("Unexpected error while searching products");
    }
  }
}

export { searchProducts };
