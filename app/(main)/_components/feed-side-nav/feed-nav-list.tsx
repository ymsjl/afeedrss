"use client";
import { useFeedSideNavData } from "@/features/subscription-source/use-feed-side-nav-data";
import { NavCategory, NavCategoryItem, NavSubItemGroup, NavSubItem, NavItem } from "@fluentui/react-nav-preview";
import React, { ComponentProps } from "react";
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

const FeedNavItem = React.memo(({ link, onClick, itemClassName }: { itemClassName?: string, link: INavItem; onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>, item: INavItem) => void; }) => {
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


export const FeedNavList = React.memo(({ onClick, itemClassName }: { onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>, item: INavItem) => void; } & Pick<ComponentProps<typeof FeedNavItem>, 'itemClassName'>) => {
  const { data } = useFeedSideNavData();
  return <>{data?.map((link) => <FeedNavItem key={link.key} link={link} onClick={onClick} itemClassName={itemClassName} />)}</>;
})

FeedNavList.displayName = "FeedNavList";