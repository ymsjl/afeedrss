import { HomePageLayout } from "@/app/(main)/_components/page-layout";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <HomePageLayout>{children}</HomePageLayout>
  );
}
