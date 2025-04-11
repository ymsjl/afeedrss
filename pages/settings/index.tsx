import React from "react";
import Link from "next/link";
import { StackShim, StackItemShim } from "@fluentui/react-migration-v8-v9";
import { List, ListItem, Text } from "@fluentui/react-components";
import SettingsLayout from "../../components/settings/layout";
import { getLayout } from "../../components/home/layout";
import {
  PersonAccounts20Regular,
  EyeLines20Regular,
  News20Regular,
  Info20Regular,
  ChevronRight20Regular,
} from "@fluentui/react-icons";
import { useListClasses } from "../../components/home/ArticleListItem";

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
    url: "/settings/subscription_source",
  },
  {
    key: "about",
    name: "关于",
    desc: "关于此应用的基本信息",
    icon: <Info20Regular />,
    url: "/settings/about",
  },
];

function Settings() {
  const listClasses = useListClasses();

  const onRenderNavItem = ({ icon, name, url, desc }: NavListItem) => (
    <Link href={url}>
      <a>
        <StackShim
          horizontal
          verticalAlign="center"
          tokens={{ childrenGap: 16 }}
        >
          <StackItemShim disableShrink>{icon}</StackItemShim>
          <StackShim grow>
            <Text className="text-black">{name}</Text>
            <Text className="text-black text-opacity-50 text-sm">{desc}</Text>
          </StackShim>
          <StackItemShim disableShrink>
            <ChevronRight20Regular />
          </StackItemShim>
        </StackShim>
      </a>
    </Link>
  );

  return (
    <SettingsLayout title="设置">
      <List className={listClasses.list}>
        {NAV_LIST.map((item) => (
          <ListItem key={item.key} className={listClasses.listItem}>
            {onRenderNavItem(item)}
          </ListItem>
        ))}
      </List>
    </SettingsLayout>
  );
}

Settings.getLayout = getLayout;

export default Settings;
