'use client'

import * as React from "react";
import { FluentSSRProvider } from "./FluentSSRProvider";
import { QueryClientProvider } from "./QueryClientProvider";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <FluentSSRProvider>
        <QueryClientProvider>
          {children}
        </QueryClientProvider>
      </FluentSSRProvider>
    </SessionProvider>
  );
}
