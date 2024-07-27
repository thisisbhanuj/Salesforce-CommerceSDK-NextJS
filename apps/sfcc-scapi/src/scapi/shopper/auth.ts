import { SCAPIRestClient } from "@/clients/PrivateSCAPIClient";
import { GuestB2CTokenResponse } from "@/types/SCAPIType";
import ClientConfigSingleton from "@/clients/ClientConfigurator";

/**
 * Get the guest user auth token
 * @returns {Promise<GuestB2CTokenResponse>}
 */
export async function getGuestUserAuthToken(): Promise<GuestB2CTokenResponse> {
  try {
    const scapiClient = new SCAPIRestClient(
      ClientConfigSingleton.getInstance("GlobalRefArch").getClientConfig(),
    );
    const response = await scapiClient.fetchAuthTokensForGuest();
    return response;
  } catch (error) {
    console.error("Error fetching guest user auth token:", error);
    throw error;
  }
}
