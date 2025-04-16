import { 
  QueryClient, 
  dehydrate as originalDehydrate,
  DehydratedState,
  DehydrateOptions,
  Query
} from '@tanstack/react-query';

// 自定义转换函数
function defaultTransformerFn(data: any): any {
  return data;
}

// 自定义查询脱水函数，不隐藏重定向错误
function customDehydrateQuery(
  query: Query,
  serializeData: (data: any) => any
): any {
  return {
    state: {
      ...query.state,
      ...(query.state.data !== undefined && {
        data: serializeData(query.state.data),
      }),
    },
    queryKey: query.queryKey,
    queryHash: query.queryHash,
    ...(query.state.status === 'pending' && {
      promise: query.promise?.then(serializeData).catch((error) => {
        // 如果是重定向错误，则保留它，不隐藏
        // if (error?.message?.includes('NEXT_REDIRECT')) {
        //   return Promise.reject(error);
        // }
        // 其他错误按照默认行为处理
        console.error(
          `A query that was dehydrated as pending ended up rejecting. [${query.queryHash}]: ${error}; The error will be preserved if it's a redirection`
        );
        return Promise.reject(
          process.env.NODE_ENV === 'production'
            ? new Error('redacted')
            : error
        );
      }),
    }),
    ...(query.meta && { meta: query.meta }),
  };
}

// 自定义脱水函数
export function customDehydrate(
  client: QueryClient,
  options: DehydrateOptions = {}
): DehydratedState {
  // 获取原始脱水状态
  const dehydratedState = originalDehydrate(client, options);

  // 替换查询的脱水处理，仅对处于待处理状态的查询进行特殊处理
  if (dehydratedState.queries) {
    dehydratedState.queries = dehydratedState.queries.map((dehydratedQuery) => {
      // 如果查询处于待处理状态并且有promise属性，则使用自定义处理
      if (dehydratedQuery.state.status === 'pending' && 'promise' in dehydratedQuery) {
        // 从客户端查询缓存中获取原始查询
        const originalQuery = client
          .getQueryCache()
          .get(dehydratedQuery.queryHash);
        
        if (originalQuery) {
          // 使用自定义脱水函数处理
          return customDehydrateQuery(
            originalQuery,
            options.serializeData ?? client.getDefaultOptions()?.dehydrate?.serializeData ?? defaultTransformerFn
          );
        }
      }
      
      // 其他情况保持不变
      return dehydratedQuery;
    });
  }

  return dehydratedState;
}