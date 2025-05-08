'use client';

import React, { Suspense } from 'react';
import { mergeClasses } from '@fluentui/react-components';
import { NavDrawer, NavDrawerBody, NavDrawerHeader, NavSectionHeader } from '@fluentui/react-nav-preview';
import { Props } from "./feed-side-nav.types";
import { useFeeSideNavState } from './use-feed-side-nav-state';
import { FeedNavTree } from '../feed-nav-tree';
import { FeedNavListSkeleton } from '../feed-nav-tree/feed-nav-tree-skeleton';
import { useClasses } from './feed-side-nav.style';

const FeedSideNav = React.memo(({ className }: Props) => {
  const classes = useClasses();
  const { isOpen, selectedValue, handleLinkClick, onOpenChange } = useFeeSideNavState();

  return (
    <NavDrawer
      open={isOpen}
      type='inline'
      onOpenChange={onOpenChange}
      selectedValue={selectedValue}
      className={mergeClasses(classes.nav, className)}
    >
      <NavDrawerHeader>
      </NavDrawerHeader>
      <NavDrawerBody>
        <NavSectionHeader>订阅源</NavSectionHeader>
        <Suspense fallback={<FeedNavListSkeleton />}>
          <FeedNavTree onClick={handleLinkClick} />
        </Suspense>
      </NavDrawerBody>
    </NavDrawer>
  )
});

FeedSideNav.displayName = "FeedSideNav";

export default FeedSideNav