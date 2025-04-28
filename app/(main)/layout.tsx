import HomePageLayout from "@/app/(main)/_components/home-page-layout";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <HomePageLayout>{children}</HomePageLayout>
  );
}
