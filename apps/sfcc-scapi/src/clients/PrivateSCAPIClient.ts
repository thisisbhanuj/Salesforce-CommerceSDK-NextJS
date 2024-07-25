import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import SCAPIRestClientInterface, { ClientConfig } from "@/types/SCAPIType";
import { SCAPIError } from "./SCAPIError";
import { generateAuthHeader } from "@/helpers/authHelper";

export class SCAPIRestClient implements SCAPIRestClientInterface {
  private client: AxiosInstance;
  private clientConfig: ClientConfig;

  private defaultErrorHandler: (error: any) => void = (error) => {
    console.error("SCAPI Error:", error);
  };

  constructor(clientConfig: ClientConfig) {
    this.client = axios.create({ baseURL: clientConfig.baseUrl });
    this.clientConfig = clientConfig;

    if (!clientConfig.fetchToken) {
      // Only add the Authorization Bearer, if we are not fetching the token
      this.client.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
          config.headers.Authorization = `Bearer ${clientConfig.parameters.accessToken}`;
          return config;
        },
        (error) => {
          return Promise.reject(
            new SCAPIError(
              "Request Error",
              error.response?.status,
              error.response?.data,
            ),
          );
        },
      );
    }
  }

  async fetchAuthTokenForGuest(): Promise<string> {
    const headers = {
      Authorization: await generateAuthHeader(this.clientConfig, true),
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");
    urlencoded.append("redirect_uri", this.clientConfig.redirectUri);

    const response = await fetch(
      `${this.clientConfig.baseUrl}/shopper/auth/v1/organizations/f_ecom_zzrl_009/oauth2/token`,
      { method: "POST", headers, body: urlencoded, redirect: "follow" },
    );

    const data = await response.json();
    // This allows for caching the token and potentially avoids
    // unnecessary token fetching on subsequent requests within the same session
    // or multiple api calls in same request
    this.clientConfig.parameters.accessToken = data.access_token;
    return data.access_token;
  }

  async fetchAuthTokenForRegisteredShopper(): Promise<string> {
    const headers = {
      Authorization: await generateAuthHeader(this.clientConfig, false),
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "credentials");
    urlencoded.append("username", this.clientConfig.shopper?.username!);
    urlencoded.append("password", this.clientConfig.shopper?.password!);
    urlencoded.append("channel_id", this.clientConfig.parameters.channelId);
    urlencoded.append("usid", this.clientConfig.parameters.usid!);
    urlencoded.append("redirect_uri", this.clientConfig.redirectUri);

    const response = await fetch(
      `${this.clientConfig.baseUrl}/shopper/auth/v1/organizations/f_ecom_zzrl_009/oauth2/token`,
      { method: "POST", headers, body: urlencoded, redirect: "follow" },
    );

    const data = await response.json();
    // This allows for caching the token and potentially avoids
    // unnecessary token fetching on subsequent requests within the same session
    // or multiple api calls in same request
    this.clientConfig.parameters.accessToken = data.access_token;
    return data.access_token;
  }

  async request<T, D = any>(
    method: "get" | "post" | "put" | "delete" | "patch",
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const accessToken = this.clientConfig.parameters.accessToken;
      if (accessToken) {
        config = {
          ...config,
          headers: {
            ...config?.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const response = await this.client[method](url, data, config);
        return response.data;
      } else {
        console.error("Access token is not set");
        throw new SCAPIError("Access Token is not set", 401, {});
      }
    } catch (error: any) {
      this.defaultErrorHandler(error);
      throw new SCAPIError(
        "Request Error",
        error.response?.status,
        error.response?.data,
      );
    }
  }

  setDefaultErrorHandler(handler: (error: any) => void) {
    this.defaultErrorHandler = handler;
  }
}
