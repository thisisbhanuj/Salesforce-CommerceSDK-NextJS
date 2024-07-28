export type CurrencyType = "USD" | "EUR" | "GBP";

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: HeadersInit;
  body?: any;
}

export type ShopperLoginPathParameters = {
  readonly organizationId: string;
};

export type TokenResponse = Partial<
  {
    access_token: string;
    id_token: string;
    refresh_token: string;
    expires_in: number;
    refresh_token_expires_in: any;
    token_type: string;
    usid: string;
    customer_id: string;
    enc_user_id: string;
    idp_access_token: string;
  } & Record<string, any>
>;

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
