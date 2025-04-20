"use client";

import React, { Suspense, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { makeStyles, mergeClasses, tokens, Skeleton, SkeletonItem } from "@fluentui/react-components";
import {
  NavCategory,
  NavCategoryItem,
  NavDrawer,
  NavDrawerBody,
  NavItem,
  NavSectionHeader,
  NavSubItem,
  NavSubItemGroup,
} from "@fluentui/react-nav-preview";
import {
  Folder20Filled,
  Folder20Regular,
  Rss20Regular,
  Rss20Filled,
  bundleIcon,
} from "@fluentui/react-icons";
import { INavItem } from "./createNav";
import { GlobalNavigationCtx } from "../home-page-layout/global-navigation-ctx";
import { useSourcePanelData } from "./useSourcePanelData";
import { useMediaQuery } from "@reactuses/core";

export interface Props {
  className?: string;
}

const Folder = bundleIcon(Folder20Filled, Folder20Regular);
const RssIcon = bundleIcon(Rss20Filled, Rss20Regular);

function FeedNavItem({ link, onClick }: { link: INavItem, onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>, item: INavItem) => void }) {
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
    )
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
  )
}

function FeedNavList({ onClick }: { onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>, item: INavItem) => void }) {
  const { data } = useSourcePanelData();
  return <>{data?.map((link) => <FeedNavItem key={link.key} link={link} onClick={onClick} />)}</>
}

function FeedNavListSkeleton() {
  const classes = useClasses()
  return (
    <>
      {Array(5).fill(null).map((_, index) =>
        <Skeleton aria-label="Loading Content" key={index} className={classes.skeleton}>
          <SkeletonItem className={classes.skeletonItem} />
        </Skeleton>
      )}
    </>
  )
}

export function SourceNavPanel({ className }: Props) {
  const classes = useClasses();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isOpen } = useContext(GlobalNavigationCtx);
  const isWide = useMediaQuery("(min-width: 480px)", true);
  const [actviedItem, setActivedItem] = React.useState<string>("");

  const handleLinkClick = (
    e?: React.MouseEvent<HTMLElement>,
    item?: INavItem
  ) => {
    e?.preventDefault();
    const params: { [key: string]: string } = {};
    for (let [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    if (item?.key) {
      params["streamId"] = item.key;
      setActivedItem(item.key);
    }
    router.push(`/?${new URLSearchParams(params).toString()}`);
  };

  return (
    <NavDrawer
      open={isOpen}
      type={isWide ? "inline" : 'overlay'}
      selectedValue={actviedItem}
      className={mergeClasses(classes.nav, className)}
    >
      <NavDrawerBody>
        <NavSectionHeader>订阅源</NavSectionHeader>
        <Suspense fallback={<FeedNavListSkeleton />}>
          <FeedNavList onClick={handleLinkClick} />
        </Suspense>
      </NavDrawerBody>
    </NavDrawer>
  );
}

export default React.memo(SourceNavPanel);

const useClasses = makeStyles({
  nav: {
    flexShrink: 0,
    backgroundColor: tokens.colorNeutralBackground4,
    paddingBlockStart: tokens.spacingVerticalS,
  },
  navItem: {
    display: "flex",
    width: "100%",
    alignItems: "center",
  },
  skeleton: {
    marginBlockEnd: tokens.spacingVerticalXXS
  },
  skeletonItem: {
    height: '40px',
  }
});
