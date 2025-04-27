'use client';
import { mergeClasses } from '@fluentui/react-components';
import { NavDrawer, NavDrawerBody, NavDrawerHeader } from '@fluentui/react-nav-preview';
import React, { Suspense } from 'react';
import { Props } from "./feed-side-nav.types";
import { useFeeSideNavState } from './use-feed-side-nav-state';
import { FeedNavList } from './feed-nav-list';
import { FeedNavListSkeleton } from './feed-nav-list-skeleton';
import { useClasses } from './feed-side-nav.style';

export const FeedSideNavDesktop = React.memo(({ className }: Props) => {
  const classes = useClasses();
  const { isOpen, selectedValue, handleLinkClick, onOpenChange } = useFeeSideNavState();

  return (
    <NavDrawer
      open={isOpen}
      onOpenChange={onOpenChange}
      type='inline'
      selectedValue={selectedValue}
      className={mergeClasses(classes.nav, className)}
    >
      <NavDrawerHeader>
      </NavDrawerHeader>
      <NavDrawerBody>
        <Suspense fallback={<FeedNavListSkeleton />}>
          <FeedNavList onClick={handleLinkClick} />
        </Suspense>
      </NavDrawerBody>
    </NavDrawer>
  )
});

FeedSideNavDesktop.displayName = "FeedSideNavDesktop";