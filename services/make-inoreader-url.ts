const PORT = process.env.NEXT_PUBLIC_PROXY_PORT || 3000;
const PROXY_PATHNAME = `http://localhost:${PORT}${process.env.NEXT_PUBLIC_PROXY_PATHNAME}`;
const READER_BASE_URL = `/reader/api/0`;

export const makeInoreaderUrl = (url: string | { pathname: string, baseUrl?: string }, proxy = true) => {
  const { pathname, baseUrl = READER_BASE_URL } = typeof url === "string" ? { pathname: url } : url;
  const origin = proxy ? PROXY_PATHNAME : process.env.NEXT_PUBLIC_INOREADER_SERVER_URL
  return `${origin}${baseUrl}${pathname}`;
}