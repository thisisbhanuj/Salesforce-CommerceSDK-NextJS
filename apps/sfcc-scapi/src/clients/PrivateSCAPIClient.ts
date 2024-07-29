import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import SCAPIRestClientInterface, {
  ClientConfig,
  RestAPIConfiguration,
} from "../types/SCAPIType";
import { SCAPIError } from "./SCAPIError";
import { findAccessTokenInRedisKV } from "../helpers/authHelper";
import PrivateClientConfigSingleton from "./PrivateClientConfigSingleton";

export class SCAPIRestClient implements SCAPIRestClientInterface {
  private client: AxiosInstance;
  private clientConfig: ClientConfig;

  constructor(config: RestAPIConfiguration) {
    const clientConfigInstance = PrivateClientConfigSingleton.getInstance(
      config.siteId,
    ).getClientConfig();
    this.clientConfig = clientConfigInstance;
    this.client = axios.create({ baseURL: this.clientConfig.baseUrl });

    if (!config.fetchToken) {
      // Only add the Authorization Bearer, if we are not fetching the token
      findAccessTokenInRedisKV(config.sessionId).then((accessToken) => {
        if (!!accessToken) {
          this.client.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
              config.headers.Authorization = `Bearer ${accessToken}`;
              config.headers["Content-Type"] = "application/json";
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
      });
    }
  }

  public getClientConfig(): ClientConfig {
    const clientConfigInstance = PrivateClientConfigSingleton.getInstance(
      process.env.SITE_ID!,
    ).getClientConfig();
    this.clientConfig = clientConfigInstance;
    return this.clientConfig;
  }

  async request<T, D = any>(
    method: "get" | "post" | "put" | "delete" | "patch",
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const accessToken = findAccessTokenInRedisKV(config?.params?.sessionId);
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

  private defaultErrorHandler: (error: any) => void = (error) => {
    console.error("SCAPI Error:", error);
  };

  setDefaultErrorHandler(handler: (error: any) => void) {
    this.defaultErrorHandler = handler;
  }
}
