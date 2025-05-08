"use client";

import HalfScreenModal from "@/components/half-screen-modal";
import { NavDrawer, NavDrawerBody, NavSectionHeader } from "@fluentui/react-nav-preview";
import React, { Suspense } from "react";
import { Props } from "../feed-side-nav/feed-side-nav.types";
import { INavItem } from "../feed-side-nav/create-nav";
import { useFeeSideNavState } from "../feed-side-nav/use-feed-side-nav-state";
import { FeedNavTree } from "../feed-nav-tree";
import { FeedNavListSkeleton } from "../feed-nav-tree/feed-nav-tree-skeleton";
import { useClasses } from "./feed-nav-modal.styles";
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
          <NavSectionHeader>
            订阅源
          </NavSectionHeader>
          <Suspense fallback={<FeedNavListSkeleton />}>
            <FeedNavTree onClick={handleNavItemClick} itemClassName={classes.navItemMobile} />
          </Suspense>
        </NavDrawerBody>
      </NavDrawer>
    </HalfScreenModal>
  );
});

FeedSideNavMobile.displayName = "FeedSideNavMobile";
