import React from "react";
import Link from "next/link";
import { StackShim, StackItemShim } from "@fluentui/react-migration-v8-v9";
import { List, ListItem, Text, makeStyles } from "@fluentui/react-components";
import SettingsLayout from "../../components/SettingsPageLayout";
import { getLayout } from "../../components/HomePageLayout";
import {
  PersonAccounts20Regular,
  EyeLines20Regular,
  News20Regular,
  Info20Regular,
  ChevronRight20Regular,
} from "@fluentui/react-icons";
import { useTextClasses } from "../../theme/commonStyles";

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
  const classes = useClasses();
  const textClasses = useTextClasses();

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
            <Text className={classes.navText}>{name}</Text>
            <Text className={`${classes.navDescText} ${textClasses.textSm}`}>{desc}</Text>
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
      <List>
        {NAV_LIST.map((item) => (
          <ListItem key={item.key}>
            {onRenderNavItem(item)}
          </ListItem>
        ))}
      </List>
    </SettingsLayout>
  );
}

Settings.getLayout = getLayout;

export default Settings;

const useClasses = makeStyles({
  navText: {
    color: "var(--colorNeutralForeground1)",
  },
  navDescText: {
    color: "var(--colorNeutralForeground1)",
    opacity: 0.5,
  },
});
