"use client";

import * as React from "react";
import { QueryClientProvider as ReactQueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { makeQueryClient } from "@/utils/getQueryClient";

export function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = React.useState(makeQueryClient);

  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </ReactQueryClientProvider>
  );
}
