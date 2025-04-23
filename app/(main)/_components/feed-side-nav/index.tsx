"use client";

import React, { Suspense} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mergeClasses } from "@fluentui/react-components";
import {
  NavDrawer,
  NavDrawerBody,
  NavDrawerHeader,
  NavSectionHeader,
} from "@fluentui/react-nav-preview";
import { INavItem } from "./create-nav";
import { useMediaQuery } from "@reactuses/core";
import { useAppStore } from "@/app/providers/app-store-provider";
import { breakpointQuerys } from '@/theme/tokens';
import { useClasses } from "./feed-side-nav.style";
import { FeedNavListSkeleton } from "./feed-nav-list-skeleton";
import { FeedNavList } from "./feed-nav-list";

export interface Props {
  className?: string;
}

export const FeedSideNav = React.memo(({ className }: Props) =>{
  const classes = useClasses();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFeedSideNavOpen = useAppStore(store => store.isFeedSideNavOpen);
  const setIsFeedSideNavOpen = useAppStore(store => store.setIsFeedSideNavOpen);
  const isMobileSSR = useAppStore(store => store.isMobileSSR);
  const isWide = useMediaQuery(breakpointQuerys.medium, !isMobileSSR);
  const [actviedItem, setActivedItem] = React.useState<string>("");

  const handleLinkClick = (
    e?: React.MouseEvent<HTMLElement>,
    item?: INavItem
  ) => {
    e?.preventDefault();
    const params: { [key: string]: string } = {};
    for (let [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    if (item?.key) {
      params["streamId"] = item.key;
      setActivedItem(item.key);
    }
    router.push(`/?${new URLSearchParams(params).toString()}`);
  };

  return (
    <NavDrawer
      open={isFeedSideNavOpen}
      onOpenChange={(_, { open }) => setIsFeedSideNavOpen(open)}
      type={isWide ? 'inline' : 'overlay'}
      selectedValue={actviedItem}
      className={mergeClasses(classes.nav, className)}
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


