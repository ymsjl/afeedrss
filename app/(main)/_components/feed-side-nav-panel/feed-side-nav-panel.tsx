'use client';

import React, { Suspense } from 'react';
import { createPresenceComponent, mergeClasses, motionTokens, tokens } from '@fluentui/react-components';
import { NavDrawer, NavDrawerBody, NavDrawerHeader, NavSectionHeader } from '@fluentui/react-nav-preview';
import { useFeedSideNavPanelState } from './use-feed-side-nav-panel-state';
import { FeedNavTree } from './feed-nav-tree';
import { FeedNavListSkeleton } from './feed-nav-tree-skeleton';
import { useClasses } from './feed-side-nav-panel.style';

const drawerWidth = "260px";

const DrawerMotion = createPresenceComponent(() => {
  const keyframes = [
    {
      opacity: 0,
      transform: "translate3D(-100%, 0, 0)",
    },
    {
      opacity: 1,
      transform: "translate3D(0, 0, 0)",
    },
  ];

  return {
    enter: {
      keyframes,
      duration: motionTokens.durationNormal,
      easing: motionTokens.curveDecelerateMin,
    },
    exit: {
      keyframes: [...keyframes].reverse(),
      duration: motionTokens.durationSlow,
      easing: motionTokens.curveAccelerateMin,
    },
  };
});

const DrawerPlaceholder = createPresenceComponent(() => {
  const keyframes = [
    {
      width: '0px',
      height: '100%',
    },
    {
      width: drawerWidth,
      height: '100%',
    },
  ];

  return {
    enter: {
      keyframes,
      duration: motionTokens.durationNormal,
      easing: motionTokens.curveDecelerateMin,
    },
    exit: {
      keyframes: [...keyframes].reverse(),
      duration: motionTokens.durationSlow,
      easing: motionTokens.curveAccelerateMin,
    },
  };
});

export const FeedSideNavPanel = React.memo(() => {
  const classes = useClasses();
  const { isOpen, selectedValue, handleLinkClick, onOpenChange } = useFeedSideNavPanelState();

  return (
    <>
      <DrawerPlaceholder visible={isOpen} >
        <div></div>
      </DrawerPlaceholder>
      <NavDrawer
        open={isOpen}
        type='inline'
        onOpenChange={onOpenChange}
        selectedValue={selectedValue}
        className={mergeClasses(classes.nav)}
        surfaceMotion={{ children: (_, props) => <DrawerMotion {...props} /> }}

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
    </>
  )
});

FeedSideNavPanel.displayName = "FeedSideNavPanel";