import React, { useEffect } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";
import { NextPageWithLayout } from "../types";
import { StorageKeys } from "../constants";
import {
  RendererProvider,
  SSRProvider,
  FluentProvider,
  GriffelRenderer,
  webLightTheme,
  createDOMRenderer,
} from "@fluentui/react-components";

// async function initMocks() {
//   if (typeof window === "undefined") return;
//   const { worker } = await import("../server/inoreader/msw-browser-worker");
//   return worker.start({
//     onUnhandledRequest: "bypass",
//   });
// }

// if (process.env.NODE_ENV === "development") {
//   initMocks();
// }

interface GlobalSettings {
  showFeedThumbnail: boolean;
}
const defaultGlobalSettings = {
  showFeedThumbnail: true,
};
export const GlobalSettingsCtx = React.createContext<{
  setGlobalSettings: React.Dispatch<React.SetStateAction<GlobalSettings>>;
  globalSettings: GlobalSettings;
}>({
  setGlobalSettings: () => {},
  globalSettings: defaultGlobalSettings,
});

type EnhancedAppProps = AppProps & { renderer?: GriffelRenderer };

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
  renderer,
}: EnhancedAppProps) {
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

  const [globalSettings, setGlobalSettings] = React.useState<GlobalSettings>(
    () => {
      let result = defaultGlobalSettings;
      if (typeof localStorage !== "undefined") {
        try {
          const settings = localStorage.getItem(StorageKeys.SETTINGS);
          if (settings !== null) {
            result = settings && JSON.parse(settings);
          }
        } catch (error) {
          console.error(error);
        }
      }
      return result;
    }
  );

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      try {
        const settings = JSON.stringify(globalSettings);
        localStorage.setItem(StorageKeys.SETTINGS, settings);
      } catch (error) {
        console.error(error);
      }
    }
  }, [globalSettings]);

  const getLayout =
    (Component as NextPageWithLayout).getLayout ||
    ((pageComponent: typeof Component) => pageComponent);

  return (
    <SessionProvider session={session}>
      <Head>
        <meta name="referrer" content="no-referrer" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <RendererProvider renderer={renderer || createDOMRenderer()}>
          <SSRProvider>
            <FluentProvider theme={webLightTheme}>
              <GlobalSettingsCtx.Provider
                value={{ globalSettings, setGlobalSettings }}
              >
                {getLayout(<Component {...pageProps} />)}
              </GlobalSettingsCtx.Provider>
            </FluentProvider>
          </SSRProvider>
        </RendererProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
