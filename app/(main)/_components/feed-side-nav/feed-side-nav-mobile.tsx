"use client";

import HalfScreenModal from "@/components/half-screen-modal";
import { NavDrawer, NavDrawerBody } from "@fluentui/react-nav-preview";
import React, { Suspense } from "react";
import { Props } from "./feed-side-nav.types";
import { INavItem } from "./create-nav";
import { useFeeSideNavState } from "./use-feed-side-nav-state";
import { FeedNavList } from "./feed-nav-list";
import { FeedNavListSkeleton } from "./feed-nav-list-skeleton";
import { useClasses } from "./feed-side-nav-mobile.styles";
import { mergeClasses } from "@fluentui/react-components";

export const FeedSideNavMobile = React.memo(({ className }: Props) => {
  const classes = useClasses();
  const { isOpen, onClose, selectedValue, handleLinkClick, } = useFeeSideNavState();
  
  const handleNavItemClick = (
    e?: React.MouseEvent<HTMLElement>,
    item?: INavItem
  ) => {
    handleLinkClick(e, item);
    onClose();
  };

  return (
    <HalfScreenModal isOpen={isOpen} onClose={onClose} size='large'>
      <NavDrawer type='inline' className={mergeClasses(classes.navDrawerMobile, className)} open={true} selectedValue={selectedValue}>
        <NavDrawerBody className={classes.navDrawerBody}>
          <Suspense fallback={<FeedNavListSkeleton />}>
            <FeedNavList onClick={handleNavItemClick} itemClassName={classes.navItemMobile} />
          </Suspense>
        </NavDrawerBody>
      </NavDrawer>
    </HalfScreenModal>
  );
});
FeedSideNavMobile.displayName = "FeedSideNavMobile";
