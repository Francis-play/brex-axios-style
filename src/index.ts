import {
  createBrexClient,
  BrexResponse,
  ClientConfig,
} from '@breimerct/brex';

/* -------------------------------------------
 * Helpers
 * ------------------------------------------ */

// Transforma parámetros en query string
function buildURLWithParams(url: string, params?: Record<string, any>): string {
  if (!params) return url;
  const query = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
      acc[k] = String(v);
      return acc;
    }, {})
  ).toString();
  return `${url}${url.includes('?') ? '&' : '?'}${query}`;
}

// Transforma respuesta de Brex a formato estilo Axios
export interface AxiosResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

function transformResponse<T>(res: BrexResponse<T>): AxiosResponse<T> {
  if (res.error) throw new Error(res.error.message);
  return {
    data: res.content!,
    status: res.status,
    headers: res.headers,
  };
}

/* -------------------------------------------
 * Tipos
 * ------------------------------------------ */

type RequestMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options';

interface RequestConfig {
  url: string;
  method?: RequestMethod;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
}

type RequestConfigForMethods = {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
};

type AxiosHeaders = Record<string, string>;

type BrexAxiosStyleOptions = ClientConfig & {
  throwOnError?: boolean;
};

type RequestInterceptor = (
  config: { url: string; headers?: Record<string, string> }
) => Promise<any> | any;

type ResponseInterceptor<T = any> = (
  res: AxiosResponse<T>
) => AxiosResponse<T> | Promise<AxiosResponse<T>>;

type ResponseErrorInterceptor = (error: any) => any;

export type BrexAxiosStyleClient = {
  get<T>(url: string, config?: RequestConfigForMethods): Promise<AxiosResponse<T>>;
  post<T>(url: string, body?: unknown, config?: RequestConfigForMethods): Promise<AxiosResponse<T>>;
  put<T>(url: string, body?: unknown, config?: RequestConfigForMethods): Promise<AxiosResponse<T>>;
  delete<T>(url: string, config?: RequestConfigForMethods): Promise<AxiosResponse<T>>;
  patch<T>(url: string, body?: unknown, config?: RequestConfigForMethods): Promise<AxiosResponse<T>>;
  request<T>(config: RequestConfig): Promise<AxiosResponse<T>>;
  defaults: {
    headers: {
      common: AxiosHeaders;
    };
  };
  interceptors: {
    request: {
      use(fn: RequestInterceptor): void;
    };
    response: {
      use(onSuccess: ResponseInterceptor, onError?: ResponseErrorInterceptor): void;
    };
  };
};

/* -------------------------------------------
 * Cliente estilo Axios con soporte de interceptores
 * ------------------------------------------ */

export function createBrexAxiosStyleClient(
  options: BrexAxiosStyleOptions
): BrexAxiosStyleClient {
  const { throwOnError = false, ...brexConfig } = options;

  const client = createBrexClient(brexConfig);
  const defaultHeaders: AxiosHeaders = {};

  // Interceptors
  const requestInterceptors: RequestInterceptor[] = [];
  const responseInterceptors: {
    onSuccess: ResponseInterceptor;
    onError?: ResponseErrorInterceptor;
  }[] = [];

  // Interceptor interno para headers globales
  client.addRequestInterceptor((config) => {
    config.headers = {
      ...defaultHeaders,
      ...(config.headers || {}),
    };
    return config;
  });

  // Función interna para aplicar interceptores
  async function applyRequestInterceptors(config: { url: string; headers?: Record<string, string> }) {
    for (const interceptor of requestInterceptors) {
      config = await interceptor(config);
    }
    return config;
  }

  async function applyResponseInterceptors<T>(res: AxiosResponse<T>): Promise<AxiosResponse<T>> {
    let result = res;
    for (const { onSuccess } of responseInterceptors) {
      result = await onSuccess(result);
    }
    return result;
  }

  async function handleWithResponseInterceptors<T>(promise: Promise<BrexResponse<T>>): Promise<AxiosResponse<T>> {
    try {
      const res = await promise;
      const transformed = transformResponse(res);
      return await applyResponseInterceptors(transformed);
    } catch (err) {
      for (const { onError } of responseInterceptors) {
        if (onError) return await onError(err);
      }
      throw err;
    }
  }

  return {
    async get<T>(url: string, config?: RequestConfigForMethods): Promise<AxiosResponse<T>> {
      const fullUrl = buildURLWithParams(url, config?.params);
      const finalConfig = await applyRequestInterceptors({ url, headers: config?.headers });
      return handleWithResponseInterceptors(client.get<T>(fullUrl, { headers: finalConfig.headers }));
    },

    async post<T>(url: string, body?: unknown, config?: RequestConfigForMethods): Promise<AxiosResponse<T>> {
      const fullUrl = buildURLWithParams(url, config?.params);
      const finalConfig = await applyRequestInterceptors({ url, headers: config?.headers });
      return handleWithResponseInterceptors(client.post<T>(fullUrl, body, { headers: finalConfig.headers }));
    },

    async put<T>(url: string, body?: unknown, config?: RequestConfigForMethods): Promise<AxiosResponse<T>> {
      const fullUrl = buildURLWithParams(url, config?.params);
      const finalConfig = await applyRequestInterceptors({ url, headers: config?.headers });
      return handleWithResponseInterceptors(client.put<T>(fullUrl, body, { headers: finalConfig.headers }));
    },

    async delete<T>(url: string, config?: RequestConfigForMethods): Promise<AxiosResponse<T>> {
      const fullUrl = buildURLWithParams(url, config?.params);
      const finalConfig = await applyRequestInterceptors({ url, headers: config?.headers });
      return handleWithResponseInterceptors(client.delete<T>(fullUrl, { headers: finalConfig.headers }));
    },

    async patch<T>(url: string, body?: unknown, config?: RequestConfigForMethods): Promise<AxiosResponse<T>> {
      const fullUrl = buildURLWithParams(url, config?.params);
      const finalConfig = await applyRequestInterceptors({ url, headers: config?.headers });
      return handleWithResponseInterceptors(client.patch<T>(fullUrl, body, { headers: finalConfig.headers }));
    },

    async request<T>(config: RequestConfig): Promise<AxiosResponse<T>> {
      const method = (config.method ?? 'get').toLowerCase() as RequestMethod;
      const fullUrl = buildURLWithParams(config.url, config.params);
      const finalConfig = await applyRequestInterceptors({ url: config.url, headers: config.headers });
      const data = config.data;

      switch (method) {
        case 'get':
          return this.get<T>(fullUrl, { headers: finalConfig.headers });

        case 'post':
          return this.post<T>(fullUrl, data, { headers: finalConfig.headers });

        case 'put':
          return this.put<T>(fullUrl, data, { headers: finalConfig.headers });

        case 'delete':
          return this.delete<T>(fullUrl, { headers: finalConfig.headers });

        case 'patch':
          return this.patch<T>(fullUrl, data, { headers: finalConfig.headers });

        default:
          return Promise.reject(new Error(`Unsupported method: ${method}`));
      }
    },

    defaults: {
      headers: {
        common: defaultHeaders,
      },
    },

    interceptors: {
      request: {
        use(fn: RequestInterceptor) {
          requestInterceptors.push(fn);
        },
      },
      response: {
        use(onSuccess: ResponseInterceptor, onError?: ResponseErrorInterceptor) {
          responseInterceptors.push({ onSuccess, onError });
        },
      },
    },
  };
}
