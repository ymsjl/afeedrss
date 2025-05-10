'use client';

import React, { Suspense } from 'react';
import { mergeClasses } from '@fluentui/react-components';
import { NavDrawer, NavDrawerBody, NavDrawerHeader, NavSectionHeader } from '@fluentui/react-nav-preview';
import { useFeedSideNavPanelState } from './use-feed-side-nav-panel-state';
import { FeedNavTree } from './feed-nav-tree';
import { FeedNavListSkeleton } from './feed-nav-tree-skeleton';
import { useClasses } from './feed-side-nav-panel.style';

export const FeedSideNavPanel = React.memo(() => {
  const classes = useClasses();
  const { isOpen, selectedValue, handleLinkClick, onOpenChange } = useFeedSideNavPanelState();

  return (
    <NavDrawer
      open={isOpen}
      type='inline'
      onOpenChange={onOpenChange}
      selectedValue={selectedValue}
      className={mergeClasses(classes.nav)}
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

FeedSideNavPanel.displayName = "FeedSideNavPanel";