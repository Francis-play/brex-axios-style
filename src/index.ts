import {
  createBrexClient,
  BrexResponse,
  ClientConfig,
} from '@breimerct/brex';

// Opcional: helper para lanzar errores si es necesario
function throwIfError<T>(res: BrexResponse<T>): T {
  if (res.error) throw new Error(res.error.message);
  return res.content!;
}

type BrexAxiosStyleClient = {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, body?: unknown): Promise<T>;
  put<T>(url: string, body?: unknown): Promise<T>;
  delete<T>(url: string): Promise<T>;
};

type BrexAxiosStyleOptions = ClientConfig & {
  throwOnError?: boolean;
};

export function createBrexAxiosStyleClient(
  options: BrexAxiosStyleOptions
): BrexAxiosStyleClient {
  const { throwOnError = false, ...brexConfig } = options;

  const client = createBrexClient(brexConfig);

  return {
    async get<T>(url: string): Promise<T> {
      const res = await client.get<T>(url);
      return throwOnError ? throwIfError(res) : (res.content as T);
    },
    async post<T>(url: string, body?: unknown): Promise<T> {
      const res = await client.post<T>(url, body);
      return throwOnError ? throwIfError(res) : (res.content as T);
    },
    async put<T>(url: string, body?: unknown): Promise<T> {
      const res = await client.put<T>(url, body);
      return throwOnError ? throwIfError(res) : (res.content as T);
    },
    async delete<T>(url: string): Promise<T> {
      const res = await client.delete<T>(url);
      return throwOnError ? throwIfError(res) : (res.content as T);
    },
  };
}
