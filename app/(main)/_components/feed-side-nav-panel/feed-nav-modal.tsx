"use client";

import { HalfScreenModal } from "@/components/half-screen-modal";
import { NavDrawer, NavDrawerBody, NavSectionHeader } from "@fluentui/react-nav-preview";
import React, { Suspense } from "react";
import { INavItem } from "./feed-nav-item.types";
import { useFeedSideNavPanelState } from "./use-feed-side-nav-panel-state";
import { FeedNavTree } from "./feed-nav-tree";
import { FeedNavListSkeleton } from "./feed-nav-tree-skeleton";
import { useClasses } from "./feed-nav-modal.styles";
import { mergeClasses } from "@fluentui/react-components";

export const FeedNavModal = React.memo(() => {
  const classes = useClasses();
  const { isOpen, onClose, selectedValue, handleLinkClick, } = useFeedSideNavPanelState();

  const handleNavItemClick = (
    e?: React.MouseEvent<HTMLElement>,
    item?: INavItem
  ) => {
    handleLinkClick(e, item);
    onClose();
  };

  return (
    <HalfScreenModal isOpen={isOpen} onClose={onClose} size='large'>
      <NavDrawer type='inline' className={mergeClasses(classes.navDrawerMobile)} open={true} selectedValue={selectedValue}>
        <NavDrawerBody className={classes.navDrawerBody}>
          <NavSectionHeader>订阅源</NavSectionHeader>
          <Suspense fallback={<FeedNavListSkeleton />}>
            <FeedNavTree onClick={handleNavItemClick} appearance="filled" />
          </Suspense>
        </NavDrawerBody>
      </NavDrawer>
    </HalfScreenModal>
  );
});

FeedNavModal.displayName = "FeedNavModal";
