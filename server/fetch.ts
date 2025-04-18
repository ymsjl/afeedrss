import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import qs from "query-string";
import { clientStore } from "@/store/appStore";

const BASE_URL = process.env.INOREADER_SERVER_URL || "/api/inoreader";
const TIMEOUT = 60 * 60 * 1000;

// HTTP 错误状态码常量
export const HTTP_ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
}

// 自定义 HTTP 错误类型
export class HttpError extends Error {
  status: number;
  statusText: string;
  responseText: string;
  isHttpError: boolean;
  needsAuthentication: boolean;

  constructor(status: number, statusText: string, responseText: string) {
    // 为不同状态码定制错误信息
    let message: string;
    switch (status) {
      case HTTP_ERROR_CODES.UNAUTHORIZED:
        message = "未授权，请重新登录";
        break;
      case HTTP_ERROR_CODES.FORBIDDEN:
        message = "无访问权限，请重新登录";
        break;
      case HTTP_ERROR_CODES.NOT_FOUND:
        message = "请求的资源不存在";
        break;
      case HTTP_ERROR_CODES.SERVER_ERROR:
        message = "服务器错误，请稍后再试";
        break;
      default:
        message = `请求失败 (${status}): ${statusText}`;
    }

    super(message);
    this.status = status;
    this.statusText = statusText;
    this.responseText = responseText;
    this.isHttpError = true;
    // 401 和 403 错误需要重新认证
    this.needsAuthentication = status === HTTP_ERROR_CODES.UNAUTHORIZED || status === HTTP_ERROR_CODES.FORBIDDEN;
    
    // 确保 instanceof 能够正常工作
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

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