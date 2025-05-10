"use client";

import React from "react";
import { mergeClasses, Tooltip } from "@fluentui/react-components";
import {
  Hamburger,
  NavDrawer,
  NavDrawerBody,
  NavDrawerFooter,
  NavDrawerHeader,
  NavItem,
} from "@fluentui/react-nav-preview";
import {
  bundleIcon,
  Settings24Regular,
  Settings24Filled,
  SearchSparkle24Regular,
  SearchSparkle24Filled,
  News24Regular,
  News24Filled,
} from "@fluentui/react-icons";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/app/providers/app-store-provider";
import { useClasses } from "./app-side-nav-bar.styles";

export interface Props {
  className?: string;
}

const NewsIcon = bundleIcon(News24Filled, News24Regular);
const SettingsIcon = bundleIcon(Settings24Filled, Settings24Regular);
const DiscoverIcon = bundleIcon(SearchSparkle24Filled, SearchSparkle24Regular);

export const AppSideNavBar: React.FC<Props> = React.memo(({ className }) => {
  const classes = useClasses();
  const pathname = usePathname()
  const toggleFeedSideNav = useAppStore(store => store.toggleFeedSideNav);

  return (
    <NavDrawer
      open
      type="inline"
      selectedValue={pathname}
      className={mergeClasses(classes.nav, className)}
    >
      <NavDrawerHeader className={classes.header}>
        <Tooltip content="Close Navigation" relationship="label">
          <Hamburger className={mergeClasses(classes.hamburger, pathname !== '/' && classes.invisible)} onClick={() => toggleFeedSideNav()} />
        </Tooltip>
      </NavDrawerHeader>
      <NavDrawerBody>
        <NavItem icon={<NewsIcon className={classes.navItemIcon} />} as="a" href="/" value='/' className={classes.navItem}>
          文章
        </NavItem>
        <NavItem icon={<DiscoverIcon className={classes.navItemIcon} />} as="a" href="/discover" value='/discover' className={classes.navItem}>
          发现
        </NavItem>
      </NavDrawerBody>
      <div className={classes.footer}>
        <NavItem icon={<SettingsIcon className={classes.navItemIcon} />} as="a" href="/settings" value='/settings' className={classes.navItem}>
          设置
        </NavItem>
      </div>
    </NavDrawer>
  );
})
