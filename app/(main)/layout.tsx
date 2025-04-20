import HomePageLayout from "@components/HomePageLayout";
import { getServerSession } from "next-auth";
import { PropsWithChildren } from "react";
import { authOptions } from "../api/auth/[...nextauth]/auth-options";
import { AppStoreProvider } from "../providers/AppStoreProvider";

export default async function Layout({ children }: PropsWithChildren<{}>) {
  const session = await getServerSession(authOptions);
  return (
    <AppStoreProvider initialState={{ session }}>
      <HomePageLayout>{children}</HomePageLayout>
    </AppStoreProvider>
  );
}
