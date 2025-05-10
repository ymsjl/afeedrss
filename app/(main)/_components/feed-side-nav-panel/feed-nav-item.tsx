"use client";

import { NavCategory, NavCategoryItem, NavSubItemGroup, NavSubItem, NavItem } from "@fluentui/react-nav-preview";
import React, { ComponentProps } from "react";
import {
  Folder20Filled,
  Folder20Regular,
  Rss20Regular,
  Rss20Filled,
  bundleIcon,
} from "@fluentui/react-icons";
import { INavItem } from "./feed-nav-item.types";
import { useClasses } from "./feed-nav-tree.style";

const Folder = bundleIcon(Folder20Filled, Folder20Regular);
const RssIcon = bundleIcon(Rss20Filled, Rss20Regular);

interface FeedNavItemProps {
  link: INavItem;
  onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>, item: INavItem) => void;
  appearance?: "default" | "filled";
}

export const FeedNavItem = React.memo(({ link, onClick, appearance }: FeedNavItemProps) => {
  const classes = useClasses();
  const itemClassName = appearance === "filled" ? classes.navItemFilled : '';

  if (link.type === "folder") {
    return (
      <NavCategory value={link.key!}>
        <NavCategoryItem icon={<Folder />} className={itemClassName}>
          {link.name}
        </NavCategoryItem>
        <NavSubItemGroup>
          {link.links?.map((subLink, subLinkIndex) => (
            <NavSubItem
              className={itemClassName}
              key={subLinkIndex}
              value={subLink.key!}
              onClick={(e) => onClick(e, subLink)}
            >
              {subLink.name}
            </NavSubItem>
          ))}
        </NavSubItemGroup>
      </NavCategory>
    );
  }

  return (
    <NavItem
      className={itemClassName}
      key={link.key}
      icon={<RssIcon />}
      value={link.key!}
      onClick={(e) => onClick(e, link)}
    >
      {link.name}
    </NavItem>
  );
})

FeedNavItem.displayName = "FeedNavItem";
