import { ClientConfig } from "@/types/SCAPIType";

class ClientConfigSingleton {
  private static instances: Record<string, ClientConfigSingleton> = {};
  private clientConfig: ClientConfig;

  private static CLIENT_ID = process.env.SLAS_PRIVATE_CLIENT_ID!;
  private static CLIENT_SECRET = process.env.SLAS_CLIENT_SECRET!;
  private static ORG_ID = process.env.COMMERCE_CLIENT_ORG_ID!;
  private static SHORT_CODE = process.env.COMMERCE_CLIENT_SHORT_CODE!;
  private static SITE_ID = process.env.SITE_ID!;
  private static BASE_URL = process.env.SCAPI_BASE_URL!;

  private constructor(channel_id: string) {
    this.clientConfig = {
      shopperApiVersion: "v1",
      fetchToken: true,
      baseUrl: ClientConfigSingleton.BASE_URL,
      parameters: {
        accessToken: undefined,
        clientId: ClientConfigSingleton.CLIENT_ID,
        secret: ClientConfigSingleton.CLIENT_SECRET,
        organizationId: ClientConfigSingleton.ORG_ID,
        shortCode: ClientConfigSingleton.SHORT_CODE,
        siteId: ClientConfigSingleton.SITE_ID,
        channelId: channel_id,
      },
      redirectUri: process.env.SLAS_REDIRECT_URI ?? "",
    };
  }

  public static getInstance(channelId: string): ClientConfigSingleton {
    if (!ClientConfigSingleton.instances[channelId]) {
      ClientConfigSingleton.instances[channelId] = new ClientConfigSingleton(
        channelId,
      );
    }
    return ClientConfigSingleton.instances[channelId];
  }

  public getClientConfig(): ClientConfig {
    return this.clientConfig;
  }
}

export default ClientConfigSingleton;
