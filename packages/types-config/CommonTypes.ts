import PrivateClientConfigSingleton from "@repo/sfcc-scapi/src/clients/PrivateClientConfigSingleton";
import { NextRequest, NextResponse } from "next/server";
import { TokenResponse } from "commerce-sdk/dist/helpers/slasClient";

export type CurrencyType = "USD" | "EUR" | "GBP";

export type Middleware = (
  req: AugmentedNextRequest,
  res: NextResponse | undefined,
  next: (error?: any) => void,
) => void | Promise<unknown>;

export interface RequestHandlerConfig<T extends Record<string, any> = {}> {
  method: string;
  middlewares: Middleware[];
  handler: (
    req: AugmentedNextRequest,
    res: NextResponse,
    config: T & { params?: Record<string, any> },
  ) => Promise<unknown>;
}

export type ExtendedConfig<T> = T & {
  shopperToken: string;
  sessionId: string;
  clientConfig: ReturnType<
    typeof PrivateClientConfigSingleton.prototype.getClientConfig
  >;
};

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: HeadersInit;
  body?: any;
}

export type ShopperLoginPathParameters = {
  readonly organizationId: string;
};

export type ShopperTokenResponse = Partial<{
  refresh_token_expires_in: any;
}> & TokenResponse;

export type ShopperLoginQueryParameters = {
  readonly clientId: string;
  readonly siteId: string;
  refresh_token?: string;
  channel_id?: string;
  hint?: string;
  redirect_uri?: string;
  response_type?: string;
  scope?: string;
  state?: string;
  usid?: string;
  code_challenge?: string;
  ui_locales?: string;
  login_id?: string;
  idp_origin?: string;
};

export type BaseUriParameters = {
  readonly shortCode: string;
  version?: string;
};

export type ShopperLoginParameters = ShopperLoginPathParameters &
  ShopperLoginQueryParameters &
  BaseUriParameters &
  Record<string, unknown>;

export type ShopperClientConfig = Readonly<{
  clientId: string;
  organizationId: string;
  shortCode: string;
  siteId: string;
}>;

export type AuthHeaderConfigurations = Partial<{
  shopper: {
    username: string;
    password: string;
  };
  guest: {
    clientSecret: string;
    clientId: string;
  };
}>;

export type RegsiteredShopperConfig = {
  username: string;
  password: string;
};

export type RedisSessionKVConfig = Partial<{
  readonly sessionId: string;
  usid: string;
  refresh_token: string;
  access_token: string;
  readonly code_challenge: string;
  customer_id: string;
  readonly idp_access_token: string;
  readonly idp_refresh_token: string;
}>;

export type Variant = {
  productId: string;
  variationValues: Record<string, string>;
  price: number;
};

export type GuestAccessTokenResponse = {
  accessToken: string;
  sessionId: string;
  refreshToken: string;
  usid: string;
};

export type ShopperSessionSCAPI = {
  accessToken: string;
  sessionId: string;
  refreshToken: string;
  usid: string;
};
export interface AugmentedNextRequest extends NextRequest {
  custom: {
    sessionId?: string;
    shopperToken?: string;
  };
}
