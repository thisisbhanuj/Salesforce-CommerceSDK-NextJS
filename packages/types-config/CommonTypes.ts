type CurrencyType = "USD" | "EUR" | "GBP";

type ShopperLoginPathParameters = {
  readonly organizationId: string;
};

type ShopperLoginQueryParameters = {
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

type BaseUriParameters = {
  readonly shortCode: string;
  version?: string;
};

type ShopperLoginParameters = ShopperLoginPathParameters &
  ShopperLoginQueryParameters &
  BaseUriParameters &
  Record<string, unknown>;

type ShopperClientConfig = Readonly<{
  clientId: string;
  organizationId: string;
  shortCode: string;
  siteId: string;
}>;

type AuthHeaderConfigurations = Partial<{
  shopper: {
    username: string;
    password: string;
  };
  guest: {
    clientSecret: string;
    clientId: string;
  };
}>;

type RedisSessionKVConfig = Partial<{
  readonly sessionId: string;
  readonly usid: string;
  readonly refresh_token: string;
  readonly access_token: string;
  readonly code_challenge: string;
  readonly customer_id: string;
  readonly idp_access_token: string;
  readonly idp_refresh_token: string;
}>;

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: HeadersInit;
  body?: any;
}

export type {
  CurrencyType,
  AuthHeaderConfigurations,
  BaseUriParameters,
  ShopperLoginQueryParameters,
  ShopperLoginParameters,
  ShopperClientConfig,
  RedisSessionKVConfig,
  ApiRequestOptions,
};
