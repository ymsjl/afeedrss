"use client";

import React, { ComponentProps } from "react";
import { TabList, Tab } from "@fluentui/react-components";
import {
  Folder20Regular,
  Folder20Filled,
  Rss20Regular,
  Rss20Filled,
  Tag20Regular,
  System20Regular,
  System20Filled,
  Tag20Filled,
  bundleIcon,
} from '@fluentui/react-icons';
import { TAB_KEYS } from "../../constants";

const FolderIcon = bundleIcon(Folder20Filled, Folder20Regular);
const RssIcon = bundleIcon(Rss20Filled, Rss20Regular);
const TagIcon = bundleIcon(Tag20Filled, Tag20Regular);
const SystemIcon = bundleIcon(System20Filled, System20Regular);

export const SubscriptionTabList = React.memo((props: ComponentProps<typeof TabList>) => (
  <TabList {...props}>
    <Tab value={TAB_KEYS.SUBSCRIPTIONS} icon={<RssIcon />}>订阅源</Tab>
    <Tab value={TAB_KEYS.FOLDER} icon={<FolderIcon />}>文件夹</Tab>
    <Tab value={TAB_KEYS.TAG} icon={<TagIcon />}>标签</Tab>
    <Tab value={TAB_KEYS.SYSTEM_FOLDER} icon={<SystemIcon />}>系统文件夹</Tab>
  </TabList>
));
