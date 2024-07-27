import { ClientConfigInit } from "commerce-sdk-isomorphic";
import { ShopperClientConfig } from "@repo/types-config/CommonTypes";

class PrivateClientConfigSingleton {
  private static instance: PrivateClientConfigSingleton;
  private clientConfig: ClientConfigInit<ShopperClientConfig>;

  private static CLIENT_ID = process.env.SLAS_PRIVATE_CLIENT_ID!;
  private static ORG_ID = process.env.COMMERCE_CLIENT_ORG_ID!;
  private static SHORT_CODE = process.env.COMMERCE_CLIENT_SHORT_CODE!;
  private static SITE_ID = process.env.SITE_ID!;
  private static CLIENT_SECRET = process.env.SLAS_CLIENT_SECRET!;

  private constructor() {
    this.clientConfig = {
      parameters: {
        clientId: PrivateClientConfigSingleton.CLIENT_ID,
        organizationId: PrivateClientConfigSingleton.ORG_ID,
        shortCode: PrivateClientConfigSingleton.SHORT_CODE,
        siteId: PrivateClientConfigSingleton.SITE_ID,
      },
    };
  }

  public static getInstance(): PrivateClientConfigSingleton {
    if (!PrivateClientConfigSingleton.instance) {
      PrivateClientConfigSingleton.instance =
        new PrivateClientConfigSingleton();
    }
    return PrivateClientConfigSingleton.instance;
  }

  public getClientConfig(): ClientConfigInit<ShopperClientConfig> {
    return this.clientConfig;
  }

  public getClientSecret(): string {
    return PrivateClientConfigSingleton.CLIENT_SECRET;
  }
}

export default PrivateClientConfigSingleton;
