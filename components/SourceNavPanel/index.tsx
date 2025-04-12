"use client";

import React, { useContext } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { makeStyles, mergeClasses, Tooltip } from "@fluentui/react-components";
import {
  AppItem,
  Hamburger,
  NavCategory,
  NavCategoryItem,
  NavDivider,
  NavDrawer,
  NavDrawerBody,
  NavDrawerHeader,
  NavItem,
  NavSectionHeader,
  NavSubItem,
  NavSubItemGroup,
} from "@fluentui/react-nav-preview";
import {
  Folder20Filled,
  Folder20Regular,
  bundleIcon,
  SettingsRegular,
} from "@fluentui/react-icons";
import { INavLink } from "./subscriptionNavTreeBuilder";
import { GlobalNavigationCtx } from "../HomePageLayout/GlobalNavigationCtx";
import { useSourcePanelData } from "./useSourcePanelData";

export interface Props {
  className?: string;
}

const Folder = bundleIcon(Folder20Filled, Folder20Regular);

export function SourceNavPanel({ className }: Props) {
  const classes = useClasses();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIsOpen, isOpen } = useContext(GlobalNavigationCtx);
  const { data } = useSourcePanelData();

  const handleLinkClick = (
    e?: React.MouseEvent<HTMLElement>,
    item?: INavLink
  ) => {
    e?.preventDefault();
    const params: { [key: string]: string } = {};
    if(item?.key){
      params.streamId = item.key;
    }
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    router.push(`/home?${new URLSearchParams(params).toString()}`);
  };

  return (
    <NavDrawer
      defaultSelectedValue="2"
      defaultSelectedCategoryValue=""
      open={isOpen}
      type="inline"
      className={mergeClasses(classes.root, className)}
    >
      <NavDrawerHeader>
        <Tooltip content="Close Navigation" relationship="label">
          <Hamburger onClick={() => setIsOpen(!isOpen)} />
        </Tooltip>
      </NavDrawerHeader>

      <NavDrawerBody>
        {data?.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            <NavSectionHeader>订阅源</NavSectionHeader>
            {group.links.map((link, linkIndex) =>
              link.type === "feed" ? (
                <NavItem
                  key={linkIndex}
                  icon={<Folder />}
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
      <NavDivider />
      <AppItem icon={<SettingsRegular />} as="a" href="/home/settings">
        设置
      </AppItem>
    </NavDrawer>
  );
}

export default React.memo(SourceNavPanel);

const useClasses = makeStyles({
  root: {
    flexShrink: 0,
  },
  nav: {},
  navItem: {
    display: "flex",
    width: "100%",
    alignItems: "center",
  },
});
