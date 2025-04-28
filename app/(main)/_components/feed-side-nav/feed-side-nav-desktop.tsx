'use client';

import React, { Suspense } from 'react';
import { Button, mergeClasses, ToggleButton } from '@fluentui/react-components';
import { NavDivider, NavDrawer, NavDrawerBody, NavDrawerFooter, NavDrawerHeader, NavItem, NavSectionHeader } from '@fluentui/react-nav-preview';
import { Props } from "./feed-side-nav.types";
import { useFeeSideNavState } from './use-feed-side-nav-state';
import { FeedNavList } from './feed-nav-list';
import { FeedNavListSkeleton } from './feed-nav-list-skeleton';
import { useClasses } from './feed-side-nav.style';
import {
  bundleIcon,
  LayoutColumnOneThirdLeft20Regular,
  LayoutColumnOneThirdLeft20Filled,
  EyeLines20Filled,
  EyeLines20Regular,
  Image20Filled,
  Image20Regular,
  WeatherSunny20Filled,
  WeatherSunny20Regular,
  WeatherMoon20Filled,
  WeatherMoon20Regular,
} from "@fluentui/react-icons";
import { useLargeThenMobile } from '@/utils/use-large-then-mobile';
import { useAppStore } from '@/app/providers/app-store-provider';
import { useSearchParams } from 'next/navigation';
import { useSearchParamNavigation } from '@/utils/use-search-param-navigation';

const LayoutIcon = bundleIcon(
  LayoutColumnOneThirdLeft20Filled,
  LayoutColumnOneThirdLeft20Regular
);

const UnreadOnlyIcon = bundleIcon(
  EyeLines20Filled,
  EyeLines20Regular
);

const HideImageIcon = bundleIcon(
  Image20Filled,
  Image20Regular
);

export const SunIcon = bundleIcon(
  WeatherSunny20Filled,
  WeatherSunny20Regular
);

export const MoonIcon = bundleIcon(
  WeatherMoon20Filled,
  WeatherMoon20Regular
);


const FeedSideNavDesktop = React.memo(({ className }: Props) => {
  const classes = useClasses();
  const { isOpen, selectedValue, handleLinkClick, onOpenChange } = useFeeSideNavState();
  const layoutTypeSelected = useAppStore((state) => state.layoutType);
  const toggleLayoutType = useAppStore((state) => state.toggleLayoutType);
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const showFeedThumbnail = useAppStore((state) => state.preferences.showFeedThumbnail);
  const toggleIsShowFeedThumbnaill = useAppStore((state) => state.toggleIsShowFeedThumbnaill);
  const isLargeThenMobile = useLargeThenMobile()
  const layoutType = isLargeThenMobile ? layoutTypeSelected : "default";
  const searchParams = useSearchParams();
  const unreadOnly = searchParams.get("unreadOnly") === 'true'
  const navigateWithSearch = useSearchParamNavigation();
  const onToggleUnreadOnly = () => navigateWithSearch('/', { unreadOnly: unreadOnly ? null : 'true' });

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
      <NavDivider />
      <NavDrawerFooter>
        <div className={classes.footerButtons}>
          <Button className={classes.footerButton} icon={theme === 'light' ? <SunIcon /> : <MoonIcon />} onClick={toggleTheme} title="夜间模式" size="large" />
          <ToggleButton className={classes.footerButton} icon={<LayoutIcon />} checked={layoutType === 'split'} onClick={toggleLayoutType} title="分栏视图" size="large" />
          <ToggleButton className={classes.footerButton} icon={<UnreadOnlyIcon filled={unreadOnly} />} checked={unreadOnly} onClick={onToggleUnreadOnly} title="仅看未读" size="large" />
          <ToggleButton className={classes.footerButton} icon={<HideImageIcon filled={showFeedThumbnail} />} checked={showFeedThumbnail} onClick={toggleIsShowFeedThumbnaill} title="展示封面" size="large" />
        </div>
      </NavDrawerFooter>
    </NavDrawer>
  )
});

FeedSideNavDesktop.displayName = "FeedSideNavDesktop";

export default FeedSideNavDesktop