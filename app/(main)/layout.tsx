import HomePageLayout from "@components/HomePageLayout";
import { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren<{}>) {
  return <HomePageLayout>{children}</HomePageLayout>;
}
