import { AxiosRequestConfig, CreateAxiosDefaults } from "axios";

interface SCAPIRestClientInterface {
    request<T = any, D = any>(method: string, url: string, data: D, config?: CreateAxiosDefaults): Promise<T>;
}

export default SCAPIRestClientInterface;

export type ClientConfig = {
    parameters: {
      base64EncodedCredentials: string,
      accessToken?: string,
      clientId: string,
      secret: string,
      organizationId: string,
      shortCode: string,
      siteId: string,
      channelId: string,
      usid?: string,
    },
    shopper?: {
      username: string,
      password: string,
    },
    baseUrl: string,
    redirectUri: string,
    fetchToken: boolean
};

export interface SCAPIResponse<T> {
  data: T;
  status: number;
  headers: any;
  usid?: string;
  config: AxiosRequestConfig;
}
