import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import qs from "query-string";
import { clientStore } from '@/store/initialize-app-store';
import { HttpError } from "./http-error";

const TIMEOUT = 60 * 60 * 1000;

type RequestSearchParams = Record<string, any>;

type RequestOptions<P extends RequestSearchParams = {}> = RequestInit & {
  params?: P;
  url: string
}

type RequestWithoutBodyOptions<P extends RequestSearchParams = {}> = Omit<RequestOptions<P>, 'body' | 'url'>


const makeFetch = () => {
  const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        cache: 'no-store'
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  const makeInterceptor = <T = any, M extends (opt: T) => T | Promise<T> = ((opt: T) => T | Promise<T>)>() => {
    const callbacks: M[] = [];
    const add = (cb: M) => callbacks.push(cb);
    const run = async (opt: T) => {
      let newOpt = opt;
      for (const cb of callbacks) {
        newOpt = await cb(newOpt);
      }
      return newOpt;
    };
    return { add, run, };
  };


  const isGoodResponse = (response: Response) => {
    return (response.status >= 200 && response.status < 300) || response.status === 304;
  }

  const interceptors = {
    request: makeInterceptor<RequestOptions>(),
  }

  const customFetch = async <TResponse = any>(options: RequestOptions): Promise<{ data: TResponse, status: number, statusText: string }> => {
    const requestEnhanced = await interceptors.request.run(options);
    const { url, ...restOptions } = requestEnhanced;
    const response = await fetchWithTimeout(url, restOptions);
    if (!isGoodResponse(response)) {
      const responseText = await response.text();
      throw new HttpError(response.status, response.statusText, responseText);
    }
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      return { data, status: response.status, statusText: response.statusText };
    }
    return { data: await response.text() as TResponse, status: response.status, statusText: response.statusText };
  };

  const shortHands = {
    get: <TResponse = any, TParams extends RequestSearchParams = {}>(url: string, options?: RequestWithoutBodyOptions<TParams>) =>
      customFetch<TResponse>({ url, ...options, method: 'GET' }),

    post: <TRequest extends (BodyInit | null), TResponse = any>(url: string, data?: TRequest, options?: RequestWithoutBodyOptions) =>
      customFetch<TResponse>({ url, ...options, method: 'POST', body: data }),

    put: <TRequest extends (BodyInit | null), TResponse = any>(url: string, data?: TRequest, options?: RequestWithoutBodyOptions) =>
      customFetch<TResponse>({ url, ...options, method: 'PUT', body: data }),

    delete: <TResponse = any>(url: string, options?: RequestWithoutBodyOptions) =>
      customFetch<TResponse>({ url, ...options, method: 'DELETE' }),
  }

  return {
    shortHands,
    interceptors,
  };
}

const fetchInstance = makeFetch();

fetchInstance.interceptors.request.add((options) => {
  const { url: originUrl, params, ...restOptions } = options;
  if (!params) return options;
  const queryString = qs.stringify(params, { skipNull: true, skipEmptyString: true });
  const url = `${originUrl}${originUrl.includes('?') ? '&' : '?'}${queryString}`;
  return { url, ...restOptions };
});

fetchInstance.interceptors.request.add(async (options) => {
  const { headers: originHeaders, ...restOptions } = options;
  let session: any;
  if (typeof window === 'undefined') {
    const { getServerSession } = await import("next-auth");
    session = await getServerSession(authOptions);
  } else {
    session = clientStore?.getState()?.session;
  }

  const headers = new Headers(originHeaders);
  if (session?.accessToken) {
    headers.set('Authorization', `Bearer ${session.accessToken}`);
  }
  return { ...restOptions, headers };
});

const fetchShortHands = fetchInstance.shortHands;

export default fetchShortHands;
