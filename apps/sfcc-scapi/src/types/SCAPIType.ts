import { AxiosRequestConfig, CreateAxiosDefaults } from "axios";

interface SCAPIRestClientInterface {
  request<T = any, D = any>(
    method: string,
    url: string,
    data: D,
    config?: CreateAxiosDefaults,
  ): Promise<T>;
}

export default SCAPIRestClientInterface;

export type ClientConfig = {
  shopperApiVersion: string;
  parameters: {
    accessToken?: string;
    clientId: string;
    secret: string;
    organizationId: string;
    shortCode: string;
    siteId: string;
    channelId: string;
    usid?: string;
  };
  shopper?: {
    username: string;
    password: string;
  };
  baseUrl: string;
  redirectUri: string;
  fetchToken: boolean;
};

export interface SCAPIResponse<T> {
  data: T;
  status: number;
  headers: any;
  usid?: string;
  config: AxiosRequestConfig;
}
export interface SetUserSessionResponse {
  message: string;
}

export interface GetUserSessionResponse {
  userSession: string;
}

export type SCAPITokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
  id_token?: string;
  refresh_token_expires_in: number;
  refresh_token: string;
  usid: string;
  customer_id: string;
  enc_user_id: string;
  idp_access_token?: string;
  idp_refresh_token?: string;
};

export type GuestB2CTokenResponse = Pick<
  SCAPITokenResponse,
  "access_token" | "refresh_token" | "usid" | "customer_id"
> & {
  sessionId: string;
};
