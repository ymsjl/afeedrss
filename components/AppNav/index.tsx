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

export function AppNav({ className }: Props) {
  const classes = useClasses();
  const { setIsOpen, isOpen } = useContext(GlobalNavigationCtx);
  const pathname = usePathname()
  return (
    <NavDrawer
      open
      type="inline"
      selectedValue={pathname}
      className={mergeClasses(classes.nav, className)}

    >
      <NavDrawerHeader className={classes.header}>
        <Tooltip content="Close Navigation" relationship="label">
          <Hamburger className={mergeClasses(classes.hamburger, pathname !== '/' && classes.invisible)} onClick={() => setIsOpen(!isOpen)} />
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
      <NavItem icon={<SettingsIcon className={classes.navItemIcon} />} as="a" href="/settings" value='/settings' className={classes.navItem}>
        设置
      </NavItem>
    </NavDrawer>
  );
}

export default React.memo(AppNav);

const useClasses = makeStyles({
  root: {
  },
  header: {
    paddingLeft: tokens.spacingHorizontalXL,
    paddingRight: tokens.spacingVerticalMNudge,
    paddingBlock: tokens.spacingVerticalM,
  },
  hamburger: {
    maxWidth: '100%',
  },
  invisible: {
    visibility: "hidden",
  },
  nav: {
    flexShrink: 0,
    maxWidth: '80px',
    zIndex: tokens.zIndexFloating,
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
