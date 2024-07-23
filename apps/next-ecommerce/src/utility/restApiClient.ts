/**
 * A class to make REST API calls.
 *
 * This class is a wrapper around the fetch API to make REST API calls.
 *
 **/
export class RestApiClient {
  private static async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    body?: any,
    options: RequestInit = {},
  ): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const config: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    };

    try {
      const response = await fetch(`${getBaseUrl()}${url}`, config);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static get<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>('GET', url, null, options);
  }

  static post<T>(url: string, body: any, options?: RequestInit): Promise<T> {
    return this.request<T>('POST', url, body, options);
  }

  static put<T>(url: string, body: any, options?: RequestInit): Promise<T> {
    return this.request<T>('PUT', url, body, options);
  }

  static delete<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>('DELETE', url, null, options);
  }
}

/**
 * @returns The base URL for the application.
 */
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_URL_DEV_API;
  } else {
    return process.env.NEXT_PUBLIC_URL_PROD_API;
  }
};
