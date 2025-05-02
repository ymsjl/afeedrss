"use client";
import { PersonAccounts20Regular, EyeLines20Regular, News20Regular, Info20Regular } from "@fluentui/react-icons";
import React from "react";
import { NavListItem } from "./page";


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
