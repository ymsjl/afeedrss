import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import qs from "query-string";
import { clientStore } from '@/store/initialize-app-store';
import { HttpError } from "./http-error";

const BASE_URL = process.env.INOREADER_SERVER_URL || "/api/inoreader";
const TIMEOUT = 60 * 60 * 1000;

type RequestSearchParams = Record<string, any>;

type RequestOptions<P extends RequestSearchParams = {}> = RequestInit & {
  params?: P;
}

type RequestWithoutBodyOptions<P extends RequestSearchParams = {}> = Omit<RequestOptions<P>, 'body'>

// 创建带超时的 fetch
const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      cache: 'no-cache'
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
    session = clientStore?.getState()?.session;
  }

  const headers = new Headers(restOptions.headers);
  if (session?.accessToken) {
    headers.set('Authorization', `Bearer ${session.accessToken}`);
  }

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
  } else {
    const responseText = await response.text();
    console.log('Error response:', responseText);
    // 使用自定义 HttpError 类抛出错误
    throw new HttpError(
      response.status,
      response.statusText,
      responseText
    );
  }
};

export default {
  get: <TResponse = any, TParams extends RequestSearchParams = {}>(url: string, options?: RequestWithoutBodyOptions<TParams>) =>
    customFetch<TResponse>(url, { ...options, method: 'GET' }),

  post: <TRequest extends (BodyInit | null), TResponse = any>(url: string, data?: TRequest, options?: RequestWithoutBodyOptions) =>
    customFetch<TResponse>(url, { ...options, method: 'POST', body: data }),

  put: <TRequest extends (BodyInit | null), TResponse = any>(url: string, data?: TRequest, options?: RequestWithoutBodyOptions) =>
    customFetch<TResponse>(url, { ...options, method: 'PUT', body: data }),

  delete: <TResponse = any>(url: string, options?: RequestWithoutBodyOptions) =>
    customFetch<TResponse>(url, { ...options, method: 'DELETE' }),
};