"use client";

import React from "react";
import Link from "next/link";
import { StackShim, StackItemShim } from "@fluentui/react-migration-v8-v9";
import {
  List,
  ListItem,
  Text,
  makeStyles,
  mergeClasses,
  tokens,
} from "@fluentui/react-components";
import { SettingsPageLayout } from "@components/SettingsPageLayout";
import {
  PersonAccounts20Regular,
  EyeLines20Regular,
  News20Regular,
  Info20Regular,
  ChevronRight20Regular,
} from "@fluentui/react-icons";
import { useTextClasses } from "@/theme/commonStyles";
import { useListClasses } from "@components/StreamContentPanel/ArticleListItem";

export interface NavListItem {
  key: string;
  name: string;
  desc?: string;
  icon?: React.ReactNode;
  url: string;
}

const NAV_LIST: NavListItem[] = [
  {
    key: "account",
    name: "账户",
    desc: "注销登录",
    icon: <PersonAccounts20Regular />,
    url: "/home/settings/account",
  },
  {
    key: "interface",
    name: "界面",
    desc: "自定义界面",
    icon: <EyeLines20Regular />,
    url: "/home/settings/interface",
  },
  {
    key: "subscription_source",
    name: "订阅源",
    desc: "管理订阅源,订阅新的 RSS 源",
    icon: <News20Regular />,
    url: "/home/settings/subscriptions",
  },
  {
    key: "about",
    name: "关于",
    desc: "关于此应用的基本信息",
    icon: <Info20Regular />,
    url: "/home/settings/about",
  },
];

export default function Settings() {
  const classes = useClasses();
  const textClasses = useTextClasses();
  const listClasses = useListClasses();

  const onRenderNavItem = ({ icon, name, url, desc }: NavListItem) => (
    <Link href={url} passHref>
      <StackShim horizontal verticalAlign="center" tokens={{ childrenGap: 16 }}>
        <StackItemShim disableShrink>{icon}</StackItemShim>
        <StackShim grow>
          <Text>{name}</Text>
          <Text
            className={mergeClasses(classes.navDescText, textClasses.textSm)}
          >
            {desc}
          </Text>
        </StackShim>
        <StackItemShim disableShrink>
          <ChevronRight20Regular />
        </StackItemShim>
      </StackShim>
    </Link>
  );

  return (
    <SettingsPageLayout>
      <List className={listClasses.list}>
        {NAV_LIST.map((item) => (
          <ListItem key={item.key} className={listClasses.listItem}>
            {onRenderNavItem(item)}
          </ListItem>
        ))}
      </List>
    </SettingsPageLayout>
  );
}

const useClasses = makeStyles({
  navDescText: {
    color: tokens.colorNeutralForeground1,
    opacity: 0.5,
  },
});
