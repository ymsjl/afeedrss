"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import { useSearchParamNavigation } from "@/utils/use-search-param-navigation";
import HalfScreenModal from "@/components/half-screen-modal";

export interface Props {
  className?: string;
}

export const FeedSideNav = React.memo(({ className }: Props) => {
  const classes = useClasses();
  const isLargeThenMobile = useLargeThenMobile();
  const isFeedSideNavOpen = useAppStore(store => store.isFeedSideNavOpen);
  const setIsFeedSideNavOpen = useAppStore(store => store.setIsFeedSideNavOpen);
  const searchParams = useSearchParams();
  const currentStreamId = searchParams.get("streamId") || undefined;
  const navigateWithSearch = useSearchParamNavigation()

  const handleLinkClick = (
    e?: React.MouseEvent<HTMLElement>,
    item?: INavItem
  ) => {
    if (!item?.key) return;
    e?.preventDefault();
    if (!isLargeThenMobile && isFeedSideNavOpen) {
      setIsFeedSideNavOpen(false);
    }
    navigateWithSearch('/', { streamId: item?.key })
  };

  if (!isLargeThenMobile) {
    return (
      <HalfScreenModal isOpen={isFeedSideNavOpen} onClose={() => setIsFeedSideNavOpen(false)} size='large' >
        <NavDrawer type='inline' className={classes.navDrawerMobile} open={true} selectedValue={currentStreamId} >
          <NavDrawerBody>
            <Suspense fallback={<FeedNavListSkeleton />}>
              <FeedNavList onClick={handleLinkClick} itemClassName={classes.navItemMobile} />
            </Suspense>
          </NavDrawerBody>
        </NavDrawer>
      </HalfScreenModal>
    )
  }

  return (
    <NavDrawer
      open={isFeedSideNavOpen}
      onOpenChange={(_, { open }) => setIsFeedSideNavOpen(open)}
      type='inline'
      selectedValue={currentStreamId}
      className={mergeClasses(classes.nav, className)}
    >
      <NavDrawerHeader>
      </NavDrawerHeader>
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


