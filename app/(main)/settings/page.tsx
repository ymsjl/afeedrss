"use client";

import React from "react";
import Link from "next/link";
import {
  List,
  ListItem,
  Text,
  makeStyles,
  mergeClasses,
  tokens,
} from "@fluentui/react-components";
import { SettingsPageLayout } from "@/app/(main)/settings/_components/settings-page-layout";
import {
  PersonAccounts20Regular,
  EyeLines20Regular,
  News20Regular,
  Info20Regular,
  ChevronRight20Regular,
} from "@fluentui/react-icons";
import { useFlexClasses, useTextClasses } from "@/theme/commonStyles";
import { useListClasses } from "../_components/stream-content-panel/stream-content-list-item.style";

export interface NavListItem {
  key: string;
  name: string;
  desc?: string;
  icon?: React.ReactNode;
  url: string;
}

export const NAV_LIST: NavListItem[] = [
  {
    key: "account",
    name: "账户",
    desc: "注销登录",
    icon: <PersonAccounts20Regular />,
    url: "/settings/account",
  },
  {
    key: "interface",
    name: "界面",
    desc: "自定义界面",
    icon: <EyeLines20Regular />,
    url: "/settings/interface",
  },
  {
    key: "subscription_source",
    name: "订阅源",
    desc: "管理订阅源,订阅新的 RSS 源",
    icon: <News20Regular />,
    url: "/settings/subscriptions",
  },
  {
    key: "about",
    name: "关于",
    desc: "关于此应用的基本信息",
    icon: <Info20Regular />,
    url: "/settings/about",
  },
];

export default function Settings() {
  const classes = useClasses();
  const textClasses = useTextClasses();
  const listClasses = useListClasses();
  const flexClasses = useFlexClasses();

  const onRenderNavItem = ({ icon, name, url, desc }: NavListItem) => (
    <Link href={url} passHref>
      <div className={classes.itemFlexContainer}>
        <div className={flexClasses.flexDisableShrink}>{icon}</div>
        <div className={mergeClasses(flexClasses.flexGrow, flexClasses.flexCol)}>
          <Text>{name}</Text>
          <Text
            className={mergeClasses(classes.navDescText, textClasses.textSm)}
          >
            {desc}
          </Text>
        </div>
        <div className={flexClasses.flexDisableShrink}>
          <ChevronRight20Regular />
        </div>
      </div>
    </Link>
  );

  return (
    <SettingsPageLayout>
      <ul className={listClasses.list}>
        {NAV_LIST.map((item) => (
          <li key={item.key} className={listClasses.listItem}>
            {onRenderNavItem(item)}
          </li>
        ))}
      </ul>
    </SettingsPageLayout>
  );
}

const useClasses = makeStyles({
  navDescText: {
    color: tokens.colorNeutralForeground1,
    opacity: 0.5,
  },
  itemFlexContainer: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalL,
  },
});
