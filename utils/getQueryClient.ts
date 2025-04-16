import {
  DefaultOptions,
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from '@tanstack/react-query'
import { customDehydrate } from './customDehydrate'

const QUERY_DEFAULT_OPTIONS: DefaultOptions = {
  queries: {
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
  },
  dehydrate: {
    shouldDehydrateQuery: (query) =>
      defaultShouldDehydrateQuery(query) ||
      query.state.status === 'pending',
  },
}

export const makeQueryClient = () => new QueryClient({ defaultOptions: QUERY_DEFAULT_OPTIONS, })

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

// 导出我们的自定义 dehydrate 函数，以便在服务器组件中使用
export { customDehydrate as dehydrate }