"use client";
import { useFeedSideNavData } from "@/features/subscription-source/use-feed-side-nav-data";
import { NavCategory, NavCategoryItem, NavSubItemGroup, NavSubItem, NavItem } from "@fluentui/react-nav-preview";
import React from "react";
import {
  Folder20Filled,
  Folder20Regular,
  Rss20Regular,
  Rss20Filled,
  bundleIcon,
} from "@fluentui/react-icons";
import { INavItem } from "./create-nav";

const Folder = bundleIcon(Folder20Filled, Folder20Regular);
const RssIcon = bundleIcon(Rss20Filled, Rss20Regular);

const FeedNavItem = React.memo(({ link, onClick }: { link: INavItem; onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>, item: INavItem) => void; }) => {
  if (link.type === "folder") {
    return (
      <NavCategory value={link.key!}>
        <NavCategoryItem icon={<Folder />}>
          {link.name}
        </NavCategoryItem>
        <NavSubItemGroup>
          {link.links?.map((subLink, subLinkIndex) => (
            <NavSubItem
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


export const FeedNavList = React.memo(({ onClick }: { onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>, item: INavItem) => void; }) => {
  const { data } = useFeedSideNavData();
  return <>{data?.map((link) => <FeedNavItem key={link.key} link={link} onClick={onClick} />)}</>;
})

FeedNavList.displayName = "FeedNavList";