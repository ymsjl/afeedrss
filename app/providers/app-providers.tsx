'use client'

import * as React from "react";
import { QueryClientProvider } from "./query-client-provider";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <QueryClientProvider>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}
