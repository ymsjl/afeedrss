'use client';

import React, { Suspense } from 'react';
import { mergeClasses } from '@fluentui/react-components';
import { NavDrawer, NavDrawerBody, NavDrawerFooter, NavDrawerHeader, NavSectionHeader } from '@fluentui/react-nav-preview';
import { Props } from "./feed-side-nav.types";
import { useFeeSideNavState } from './use-feed-side-nav-state';
import { FeedNavList } from './feed-nav-list';
import { FeedNavListSkeleton } from './feed-nav-list-skeleton';
import { useClasses } from './feed-side-nav.style';
import { FeedSideNavTools } from './feed-side-nav-tools'; // Import the new component

const FeedSideNavDesktop = React.memo(({ className }: Props) => {
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
        <NavSectionHeader>
          订阅源
        </NavSectionHeader>
        <Suspense fallback={<FeedNavListSkeleton />}>
          <FeedNavList onClick={handleLinkClick} />
        </Suspense>
      </NavDrawerBody>
      <NavDrawerFooter>
        <FeedSideNavTools />
      </NavDrawerFooter>
    </NavDrawer>
  )
});

FeedSideNavDesktop.displayName = "FeedSideNavDesktop";

export default FeedSideNavDesktop