import { ClientConfig } from "../types/SCAPIType";

class PrivateClientConfigSingleton {
  private static instances: Record<string, PrivateClientConfigSingleton> = {};
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
      baseUrl: PrivateClientConfigSingleton.BASE_URL,
      parameters: {
        accessToken: undefined,
        clientId: PrivateClientConfigSingleton.CLIENT_ID,
        secret: PrivateClientConfigSingleton.CLIENT_SECRET,
        organizationId: PrivateClientConfigSingleton.ORG_ID,
        shortCode: PrivateClientConfigSingleton.SHORT_CODE,
        siteId: PrivateClientConfigSingleton.SITE_ID,
        channelId: channel_id,
      },
      redirectUri: process.env.SLAS_REDIRECT_URI ?? "",
    };
  }

  public static getInstance(channelId: string): PrivateClientConfigSingleton {
    if (!PrivateClientConfigSingleton.instances[channelId]) {
      PrivateClientConfigSingleton.instances[channelId] =
        new PrivateClientConfigSingleton(channelId);
    }
    return PrivateClientConfigSingleton.instances[channelId];
  }

  public getClientConfig(): ClientConfig {
    return this.clientConfig;
  }
}

export default PrivateClientConfigSingleton;
