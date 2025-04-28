"use client";

import HalfScreenModal from "@/components/half-screen-modal";
import { NavDrawer, NavDrawerBody, NavDrawerFooter, NavDrawerHeader } from "@fluentui/react-nav-preview";
import React, { Suspense } from "react";
import { Props } from "./feed-side-nav.types";
import { INavItem } from "./create-nav";
import { useFeeSideNavState } from "./use-feed-side-nav-state";
import { FeedNavList } from "./feed-nav-list";
import { FeedNavListSkeleton } from "./feed-nav-list-skeleton";
import { useClasses } from "./feed-side-nav.style";
import { Button, mergeClasses, ToggleButton } from "@fluentui/react-components";
import { useAppStore } from "@/app/providers/app-store-provider";

import {
  bundleIcon,
  EyeLines20Filled,
  EyeLines20Regular,
  Image20Filled,
  Image20Regular
} from "@fluentui/react-icons";
import { useLargeThenMobile } from '@/utils/use-large-then-mobile';
import { useSearchParams } from 'next/navigation';
import { useSearchParamNavigation } from '@/utils/use-search-param-navigation';
import { MoonIcon, SunIcon } from "./feed-side-nav-desktop";

const UnreadOnlyIcon = bundleIcon(
  EyeLines20Filled,
  EyeLines20Regular
);

const HideImage = bundleIcon(
  Image20Filled,
  Image20Regular
);

export const FeedSideNavMobile = React.memo(({ className }: Props) => {
  const classes = useClasses();
  const { isOpen, onClose, selectedValue, handleLinkClick, } = useFeeSideNavState();
  const showFeedThumbnail = useAppStore((state) => state.preferences.showFeedThumbnail);
  const toggleIsShowFeedThumbnaill = useAppStore((state) => state.toggleIsShowFeedThumbnaill);

  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);

  const searchParams = useSearchParams();
  const unreadOnly = searchParams.get("unreadOnly") === 'true'
  const navigateWithSearch = useSearchParamNavigation();
  const onToggleUnreadOnly = () => navigateWithSearch('/', { unreadOnly: unreadOnly ? null : 'true' });

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
        <NavDrawerFooter>
          <div className={classes.footerButtons}>
            <Button className={classes.footerButton} icon={theme === 'light' ? <SunIcon /> : <MoonIcon />} onClick={toggleTheme} title="夜间模式" size="large" >夜间模式</Button>
            <ToggleButton className={classes.footerButton} icon={<UnreadOnlyIcon filled={unreadOnly} />} checked={unreadOnly} onClick={onToggleUnreadOnly} title="仅看未读" size="large" >仅看未读</ToggleButton>
            <ToggleButton className={classes.footerButton} icon={<HideImage filled={showFeedThumbnail} />} checked={showFeedThumbnail} onClick={toggleIsShowFeedThumbnaill} title="展示封面" size="large" >展示封面</ToggleButton>
          </div>
        </NavDrawerFooter>
      </NavDrawer>
    </HalfScreenModal>
  );
});
FeedSideNavMobile.displayName = "FeedSideNavMobile";
