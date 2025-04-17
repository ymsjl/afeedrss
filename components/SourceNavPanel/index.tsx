"use client";

import React, { useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
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
import { INavLink } from "./FeedTreeBuilder";
import { GlobalNavigationCtx } from "../HomePageLayout/GlobalNavigationCtx";
import { useSourcePanelData } from "./useSourcePanelData";

export interface Props {
  className?: string;
}

const Folder = bundleIcon(Folder20Filled, Folder20Regular);
const RssIcon = bundleIcon(Rss20Filled, Rss20Regular);

export function SourceNavPanel({ className }: Props) {
  const classes = useClasses();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isOpen } = useContext(GlobalNavigationCtx);
  const { data } = useSourcePanelData();
  const [actviedItem, setActivedItem] = React.useState<string>("");

  const handleLinkClick = (
    e?: React.MouseEvent<HTMLElement>,
    item?: INavLink
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
      type="inline"
      selectedValue={actviedItem}
      className={mergeClasses(classes.nav, className)}
    >
      <NavDrawerBody>
        {data?.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            <NavSectionHeader>订阅源</NavSectionHeader>
            {group.links.map((link, linkIndex) =>
              link.type !== "folder" ? (
                <NavItem
                  key={linkIndex}
                  icon={<RssIcon />}
                  value={link.key!}
                  onClick={(e) => handleLinkClick(e, link)}
                >
                  {link.name}
                </NavItem>
              ) : link.type === "folder" ? (
                <NavCategory key={linkIndex} value={link.key!}>
                  <NavCategoryItem icon={<Folder />}>
                    {link.name}
                  </NavCategoryItem>
                  <NavSubItemGroup>
                    {link.links?.map((subLink, subLinkIndex) => (
                      <NavSubItem
                        key={subLinkIndex}
                        value={subLink.key!}
                        onClick={(e) => handleLinkClick(e, subLink)}
                      >
                        {subLink.name}
                      </NavSubItem>
                    ))}
                  </NavSubItemGroup>
                </NavCategory>
              ) : null
            )}
          </React.Fragment>
        ))}
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
});
