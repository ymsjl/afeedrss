"use client";

import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { GlobalSettingProvider } from "./GlobalSettingProvider";
import { FluentSSRProvider } from "./FluentSSRProvider";
import { QueryClientProvider } from "./QueryClientProvider";
import { AppStoreProvider } from "./AppStoreProvider";
import "@/styles/globals.css";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <FluentSSRProvider>
        <QueryClientProvider>
          <AppStoreProvider>
            <GlobalSettingProvider>{children}</GlobalSettingProvider>
          </AppStoreProvider>
        </QueryClientProvider>
      </FluentSSRProvider>
    </SessionProvider>
  );
}
