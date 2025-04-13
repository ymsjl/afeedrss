import { getSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import qs from "query-string";

const BASE_URL = process.env.INOREADER_SERVER_URL || "/api/inoreader";
const TIMEOUT = 60 * 60 * 1000;

export interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
}

// 创建带超时的 fetch
const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// 自定义 fetch 函数
const customFetch = async <TResponse = any>(url: string, options: RequestOptions = {}): Promise<{ data: TResponse, status: number, statusText: string }> => {
  // 处理查询参数
  const { params, ...restOptions } = options;
  let fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  if (params) {
    const queryString = qs.stringify(params, { skipNull: true, skipEmptyString: true });
    fullUrl = `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}${queryString}`;
  }

  // 获取 session 并添加认证头
  let session: any;
  if (typeof window === 'undefined') {
    const { getServerSession } = await import("next-auth");
    session = await getServerSession(authOptions);
  } else {
    session = await getSession();
  }
  const headers = new Headers(restOptions.headers);
  if (session?.accessToken) {
    headers.set('Authorization', `Bearer ${session.accessToken}`);
  }

  try {
    const response = await fetchWithTimeout(fullUrl, {
      ...restOptions,
      headers
    });

    // 处理响应
    if ((response.status >= 200 && response.status < 300) || response.status === 304) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const data = await response.json();
        return { data, status: response.status, statusText: response.statusText };
      }
      // 对于非 JSON 响应，将文本作为 any 类型处理
      return { data: await response.text() as TResponse, status: response.status, statusText: response.statusText };
    }

    throw new Error(`${response.status}: ${response.statusText}`);
  } catch (error: any) {
    // 处理认证错误
    if (error instanceof Response) {
      // 如果错误是 Response 对象
      if (error.status === 403 || error.status === 401) {
        if (typeof window !== 'undefined') {
          window.location.pathname = '/auth/signin';
        }
      }
      const errorText = await error.text();
      if (errorText === "AppId required! Contact app developer. See https://inoreader.dev") {
        if (typeof window !== 'undefined') {
          window.location.pathname = '/auth/signin';
        }
      }
    } else if (error.status === 403 || error.status === 401) {
      // 处理普通错误对象的认证错误
      if (typeof window !== 'undefined') {
        window.location.pathname = '/auth/signin';
      }
    }
    throw error;
  }
};

export default {
  get: <TResponse = any>(url: string, options?: RequestOptions) =>
    customFetch<TResponse>(url, { ...options, method: 'GET' }),
  post: <TRequest = any, TResponse = any>(url: string, data?: TRequest, options?: RequestOptions) =>
    customFetch<TResponse>(url, { ...options, method: 'POST', body: JSON.stringify(data) }),
  put: <TRequest = any, TResponse = any>(url: string, data?: TRequest, options?: RequestOptions) =>
    customFetch<TResponse>(url, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  delete: <TResponse = any>(url: string, options?: RequestOptions) =>
    customFetch<TResponse>(url, { ...options, method: 'DELETE' }),
};