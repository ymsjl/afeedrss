"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider as Provider } from "react-query";

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return <Provider client={queryClient}>{children}</Provider>;
}
