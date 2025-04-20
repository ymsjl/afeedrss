"use client";

import React, { useContext } from "react";
import { makeStyles, mergeClasses, tokens, Tooltip } from "@fluentui/react-components";
import {
  Hamburger,
  NavDrawer,
  NavDrawerBody,
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
import { GlobalNavigationCtx } from "../HomePageLayout/GlobalNavigationCtx";
import { usePathname } from "next/navigation";

export interface Props {
  className?: string;
}

const NewsIcon = bundleIcon(News24Filled, News24Regular);
const SettingsIcon = bundleIcon(Settings24Filled, Settings24Regular);
const DiscoverIcon = bundleIcon(SearchSparkle24Filled, SearchSparkle24Regular);

export function TabBar({ className }: Props) {
  const classes = useClasses();
  const { setIsOpen, isOpen } = useContext(GlobalNavigationCtx);
  const pathname = usePathname()
  return (
    <div className={mergeClasses(classes.stickyBar, className)}>
      <div className={classes.nav}>
        <NavItem icon={<NewsIcon className={classes.navItemIcon} />} as="a" href="/" value='/' className={classes.navItem}>
          文章
        </NavItem>
        <NavItem icon={<DiscoverIcon className={classes.navItemIcon} />} as="a" href="/discover" value='/discover' className={classes.navItem}>
          发现
        </NavItem>
        <NavItem icon={<SettingsIcon className={classes.navItemIcon} />} as="a" href="/settings" value='/settings' className={classes.navItem}>
          设置
        </NavItem>
      </div>
    </div>
  );
}

export default React.memo(TabBar);

const useClasses = makeStyles({
  root: {
  },
 
  hamburger: {
    maxWidth: '100%',
  },
  invisible: {
    visibility: "hidden",
  },
  stickyBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: tokens.colorNeutralBackground1,
    zIndex: tokens.zIndexFloating,
    boxShadow: tokens.shadow4,
    paddingTop: 0,
    paddingBottom: 0,
  },
  nav: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexShrink: 0,
    maxWidth: '100%',
    zIndex: tokens.zIndexFloating,
    height: "56px",
  },
  navItem: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: tokens.spacingVerticalXS,
    fontSize: tokens.fontSizeBase200,
    alignItems: "center",
    "::after": {
      left: "0",
      top: "0",
      bottom: "0",
      marginInlineStart: "0",
      marginBlock: "auto",
      height: "32px",
    }
  },
  navItemIcon: {
    fontSize: tokens.fontSizeBase600,
  }
});
