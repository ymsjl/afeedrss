"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mergeClasses } from "@fluentui/react-components";
import {
  NavDrawer,
  NavDrawerBody,
  NavDrawerHeader,
  NavSectionHeader,
} from "@fluentui/react-nav-preview";
import { INavItem } from "./create-nav";
import { useAppStore } from "@/app/providers/app-store-provider";
import { useClasses } from "./feed-side-nav.style";
import { FeedNavListSkeleton } from "./feed-nav-list-skeleton";
import { FeedNavList } from "./feed-nav-list";
import { useLargeThenMobile } from "@/utils/use-large-then-mobile";

export interface Props {
  className?: string;
}

export const FeedSideNav = React.memo(({ className }: Props) => {
  const classes = useClasses();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFeedSideNavOpen = useAppStore(store => store.isFeedSideNavOpen);
  const setIsFeedSideNavOpen = useAppStore(store => store.setIsFeedSideNavOpen);
  const isLargeThenMobile = useLargeThenMobile();
  const [actviedItem, setActivedItem] = React.useState<string>("");

  const handleLinkClick = (
    e?: React.MouseEvent<HTMLElement>,
    item?: INavItem
  ) => {
    e?.preventDefault();
    const params: { [key: string]: string } = Object.fromEntries(searchParams.entries());
    if (item?.key) {
      params["streamId"] = item.key;
      setActivedItem(item.key);
    }

    if (!isLargeThenMobile && isFeedSideNavOpen) {
      setIsFeedSideNavOpen(false);
    }

    router.push(`/?${new URLSearchParams(params).toString()}`);
  };

  return (
    <NavDrawer
      open={isFeedSideNavOpen}
      onOpenChange={(_, { open }) => setIsFeedSideNavOpen(open)}
      type={isLargeThenMobile ? 'inline' : 'overlay'}
      selectedValue={actviedItem}
      className={mergeClasses(classes.nav, className)}
      position={isLargeThenMobile ? "start" : "bottom"}
    >
      <NavDrawerHeader></NavDrawerHeader>
      <NavDrawerBody>
        <NavSectionHeader>订阅源</NavSectionHeader>
        <Suspense fallback={<FeedNavListSkeleton />}>
          <FeedNavList onClick={handleLinkClick} />
        </Suspense>
      </NavDrawerBody>
    </NavDrawer>
  );
})

FeedSideNav.displayName = "FeedSideNav";


