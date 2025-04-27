import HomePageLayout from "@/app/(main)/_components/home-page-layout";
import { getServerSession } from "next-auth";
import { PropsWithChildren } from "react";
import { authOptions } from "../api/auth/[...nextauth]/auth-options";
import { AppStoreProvider } from "../providers/app-store-provider";
import { cookies, headers } from "next/headers";
import detectIsMobile from "ismobilejs";
import { AppState, STORAGE_NAME } from "@/store/app-store";

export default async function Layout({ children }: PropsWithChildren<{}>) {
  const [
    session,
    hds,
    cks,
  ] = await Promise.all([getServerSession(authOptions), headers(), cookies()])
  const userAgent = hds.get("user-agent")
  const isMobile = detectIsMobile(userAgent ?? '').any;
  const appState: { state: AppState } = JSON.parse(cks.get(STORAGE_NAME)?.value ?? "{}")

  return (
    <AppStoreProvider initialState={{ ...appState.state, session, isMobileSSR: isMobile, isFeedSideNavOpen: !isMobile }}>
      <HomePageLayout>{children}</HomePageLayout>
    </AppStoreProvider>
  );
}
