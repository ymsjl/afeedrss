"use client";

import React from "react";
import {
  Menu,
  MenuButton,
  MenuGroup,
  MenuGroupHeader,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuProps,
  MenuTrigger,
} from "@fluentui/react-components";
import {
  bundleIcon,
  Image20Filled,
  Image20Regular,
  AppsListDetail20Filled,
  AppsListDetail20Regular,
} from "@fluentui/react-icons";
import { useAppStore } from "@/app/providers/app-store-provider";

interface ArticleLayoutMenuButtonProps {
  className?: string;
}

const ImageIcon = bundleIcon(Image20Filled, Image20Regular);

const ListContentIcon = bundleIcon(AppsListDetail20Filled, AppsListDetail20Regular);

export const ArticleLayoutMenuButton = ({ className }: ArticleLayoutMenuButtonProps) => {
  const streamItemDisplayType = useAppStore(
    (state) => state.streamItemDisplayType
  );
  const setStreamItemDisplayType = useAppStore(
    (state) => state.setStreamItemDisplayType
  );

  const onChange: MenuProps["onCheckedValueChange"] = (
    e,
    { name, checkedItems }
  ) => {
    if (name === "streamItemDisplayType") {
      setStreamItemDisplayType(checkedItems[0] as any);
    }
  };

  return (
    <Menu
      checkedValues={{ streamItemDisplayType: [streamItemDisplayType] }}
      onCheckedValueChange={onChange}
    >
      <MenuTrigger disableButtonEnhancement>
        <MenuButton
          className={className}
          icon={streamItemDisplayType === "pictureOnBottom" ? <ImageIcon /> : <ListContentIcon />}
          title="文章卡片布局"
        />
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
  );
};

ArticleLayoutMenuButton.displayName = "ArticleLayoutMenuButton";
