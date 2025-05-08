"use client";

import React from "react";
import {
  Button,
  makeStyles,
  Menu,
  MenuButton,
  MenuGroup,
  MenuGroupHeader,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuProps,
  MenuTrigger,
  ToggleButton,
  tokens,
} from "@fluentui/react-components";
import {
  bundleIcon,
  LayoutColumnOneThirdLeft20Regular,
  LayoutColumnOneThirdLeft20Filled,
  Image20Filled,
  Image20Regular,
  AppsListDetail20Filled,
  AppsListDetail20Regular,
  EyeLines20Filled,
  EyeLines20Regular,
  WeatherSunny20Filled,
  WeatherSunny20Regular,
  WeatherMoon20Filled,
  WeatherMoon20Regular,
} from "@fluentui/react-icons";
import { useAppStore } from "@/app/providers/app-store-provider";
import { useSearchParams } from "next/navigation";
import { useSearchParamNavigation } from "@/utils/use-search-param-navigation";
import { useLargeThenMobile } from '@/utils/use-large-then-mobile';
import { appTokens } from "@/theme/tokens";

const LayoutIcon = bundleIcon(
  LayoutColumnOneThirdLeft20Filled,
  LayoutColumnOneThirdLeft20Regular
);

const UnreadOnlyIcon = bundleIcon(EyeLines20Filled, EyeLines20Regular);

export const SunIcon = bundleIcon(
  WeatherSunny20Filled,
  WeatherSunny20Regular
);

export const MoonIcon = bundleIcon(WeatherMoon20Filled, WeatherMoon20Regular);

export const ImageIcon = bundleIcon(Image20Filled, Image20Regular);

export const ListContentIcon = bundleIcon(
  AppsListDetail20Filled,
  AppsListDetail20Regular
);

const useClasses = makeStyles({
  footerButtons: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    width: '100%',
    paddingBlock: tokens.spacingVerticalS,
    [appTokens.breakpoints.medium]: {
      paddingBlockEnd: tokens.spacingVerticalXL,
    }
  },
  footerButton: {
    maxWidth: "100%",
    flexGrow: 1,
    flexDirection: 'column',
    fontSize: tokens.fontSizeBase200
  }
});

export const FeedSideNavTools = () => {
  const classes = useClasses();
  const streamItemDisplayType = useAppStore(
    (state) => state.streamItemDisplayType
  );
  const setStreamItemDisplayType = useAppStore(
    (state) => state.setStreamItemDisplayType
  );
  const layoutTypeSelected = useAppStore((state) => state.layoutType);
  const toggleLayoutType = useAppStore((state) => state.toggleLayoutType);
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const isLargeThenMobile = useLargeThenMobile();
  const layoutType = isLargeThenMobile ? layoutTypeSelected : "default";
  const searchParams = useSearchParams();
  const unreadOnly = searchParams.get("unreadOnly") === "true";
  const navigateWithSearch = useSearchParamNavigation();
  const onToggleUnreadOnly = () =>
    navigateWithSearch("/", { unreadOnly: unreadOnly ? null : "true" });

  const onChange: MenuProps["onCheckedValueChange"] = (
    e,
    { name, checkedItems }
  ) => {
    if (name === "streamItemDisplayType") {
      setStreamItemDisplayType(checkedItems[0] as any);
    }
  };

  return (
    <div className={classes.footerButtons}>
      <Menu
        checkedValues={{ streamItemDisplayType: [streamItemDisplayType] }}
        onCheckedValueChange={onChange}
      >
        <MenuTrigger disableButtonEnhancement>
          <MenuButton
            className={classes.footerButton}
            icon={
              streamItemDisplayType === "pictureOnBottom" ? (
                <ImageIcon />
              ) : (
                <ListContentIcon />
              )
            }
          ></MenuButton>
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuGroup>
              <MenuGroupHeader>文章卡片布局</MenuGroupHeader>
              <MenuItemRadio
                icon={<ListContentIcon />}
                name="streamItemDisplayType"
                value="default"
              >
                默认
              </MenuItemRadio>
              <MenuItemRadio
                icon={<ImageIcon />}
                name="streamItemDisplayType"
                value="pictureOnBottom"
              >
                大图
              </MenuItemRadio>
            </MenuGroup>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Button
        className={classes.footerButton}
        icon={theme === "light" ? <SunIcon /> : <MoonIcon />}
        onClick={toggleTheme}
        title="夜间模式"
        size="large"
      />
      <ToggleButton
        className={classes.footerButton}
        icon={<LayoutIcon />}
        checked={layoutType === "split"}
        onClick={toggleLayoutType}
        title="分栏视图"
        size="large"
      />
      <ToggleButton
        className={classes.footerButton}
        icon={<UnreadOnlyIcon filled={unreadOnly} />}
        checked={unreadOnly}
        onClick={onToggleUnreadOnly}
        title="仅看未读"
        size="large"
      />
    </div>
  );
};

FeedSideNavTools.displayName = "FeedSideNavTools";