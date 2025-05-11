import type { Metadata, Viewport } from "next";
import { Providers } from "./providers/app-providers";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/auth-options";
import { AppStoreProvider } from "./providers/app-store-provider";
import { FluentSSRProvider } from "./providers/fluent-ssr-rrovider";
import { cookies, headers } from "next/headers";
import detectIsMobile from "ismobilejs";
import { AppState, STORAGE_NAME, AppTheme, defaultInitState } from "@/store/app-store";
import { NProgressProvider } from "./providers/nprogress-provider"; // Added import

export const metadata: Metadata = {
  title: "A Feed RSS",
  description: "Welcome to AFeed RSS",
};

export async function generateViewport(): Promise<Viewport> {
  const cookieStore = cookies();
  const appStateCookieValue = cookieStore.get(STORAGE_NAME)?.value;
  let currentTheme: AppTheme = defaultInitState.theme; // Use default from store

  if (appStateCookieValue) {
    try {
      const parsedCookie: { state?: { theme?: AppTheme } } = JSON.parse(appStateCookieValue);
      if (parsedCookie.state && parsedCookie.state.theme) {
        currentTheme = parsedCookie.state.theme;
      }
    } catch (e) {
    }
  }

  return {
    colorScheme: currentTheme,
    themeColor: currentTheme === 'dark' ? '#0a0a0a' : '#f0f0f0',
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [
    session,
    hds,
    cks,
  ] = await Promise.all([getServerSession(authOptions), headers(), cookies()]);
  const userAgent = hds.get("user-agent");
  const isMobile = detectIsMobile(userAgent ?? '').any;

  const appStateCookieRaw = cks.get(STORAGE_NAME)?.value;
  let parsedAppStateFromCookie: Partial<AppState> = {};

  if (appStateCookieRaw) {
    try {
      const parsedJson = JSON.parse(appStateCookieRaw);
      if (parsedJson && typeof parsedJson.state === 'object' && parsedJson.state !== null) {
        parsedAppStateFromCookie = parsedJson.state;
      }
    } catch (e) {
    }
  }

  const initialState: AppState = {
    ...defaultInitState,
    ...parsedAppStateFromCookie,
    session,
    isMobileSSR: isMobile,
    isFeedSideNavOpen: !isMobile,
    theme: parsedAppStateFromCookie.theme || defaultInitState.theme,
  };


  return (
    <html lang="zh-CN" data-theme={initialState.theme} suppressHydrationWarning>
      <body>
        <Providers>
          <AppStoreProvider initialState={initialState}>
            <FluentSSRProvider>
              <NProgressProvider />
              {children}
            </FluentSSRProvider>
          </AppStoreProvider>
        </Providers>
      </body>
    </html>
  );
}
