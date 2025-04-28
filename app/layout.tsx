import type { Metadata } from "next";
import { Providers } from "./providers/app-providers";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/auth-options";
import { AppStoreProvider } from "./providers/app-store-provider";
import { FluentSSRProvider } from "./providers/fluent-ssr-rrovider";
import { cookies, headers } from "next/headers";
import detectIsMobile from "ismobilejs";
import { AppState, STORAGE_NAME } from "@/store/app-store";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to AFeed RSS",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [
    session,
    hds,
    cks,
  ] = await Promise.all([getServerSession(authOptions), headers(), cookies()])
  const userAgent = hds.get("user-agent")
  const isMobile = detectIsMobile(userAgent ?? '').any;
  const appState: { state: AppState } = JSON.parse(cks.get(STORAGE_NAME)?.value ?? "{}")
  const initialState = { ...appState.state, session, isMobileSSR: isMobile, isFeedSideNavOpen: !isMobile }

  return (
    <html lang="en">
      <body>
        <Providers>
          <AppStoreProvider initialState={initialState}>
            <FluentSSRProvider>
              {children}
            </FluentSSRProvider>
          </AppStoreProvider>
        </Providers>
      </body>
    </html>
  );
}
