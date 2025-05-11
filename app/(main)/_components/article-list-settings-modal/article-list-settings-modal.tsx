"use client";

import React from "react";
import { HalfScreenModal } from "@/components/half-screen-modal";
import { useClasses } from "./article-list-settings-modal.style";
import { Button, mergeClasses, Radio, RadioGroup, Switch } from "@fluentui/react-components";
import { useAppStore } from "@/app/providers/app-store-provider";

import { ChevronRight20Regular } from "@fluentui/react-icons";
import { useRouter, useSearchParams } from 'next/navigation';
import { useSearchParamNavigation } from '@/utils/use-search-param-navigation';
import { MoonIcon, SunIcon } from "../theme-toggle-button";
import { StreamItemDisplayType } from "@/store/app-store";
import { NAV_LIST } from "../../settings/NAV_LIST";
import { UnreadOnlyIcon } from "../unread-only-toggle-button";

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  actionElemnt?: React.ReactNode;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ icon, label, actionElemnt = null }) => {
  const classes = useClasses();
  return (
    <li className={classes.listItem}>
      <div className={classes.rowItem}>
        <div className={classes.rowIcon}>
          {icon}
        </div>
        <div className={classes.rowLabel}>{label}</div>
        <div className={classes.rowAction}>
          {actionElemnt}
        </div>
      </div>
    </li>
  );
};

export const ArticleListSettingsModal = React.memo(({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const classes = useClasses();
  const streamItemDisplayType = useAppStore((state) => state.streamItemDisplayType);
  const setStreamItemDisplayType = useAppStore((state) => state.setStreamItemDisplayType);
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);

  const searchParams = useSearchParams();
  const unreadOnly = searchParams.get("unreadOnly") === 'true'
  const router = useRouter();
  const navigateWithSearch = useSearchParamNavigation();
  const onToggleUnreadOnly = () => navigateWithSearch('/', { unreadOnly: unreadOnly ? null : 'true' });

  return (
    <HalfScreenModal isOpen={isOpen} onClose={onClose} size='large'>
      <div className={classes.root}>
        <div className={classes.sectionHeader}>界面</div>
        <div className={classes.list}>
          <SettingsRow
            icon={theme === 'light' ? <SunIcon /> : <MoonIcon />}
            label='主题'
            actionElemnt={<Switch onChange={() => toggleTheme()} checked={theme === 'light'} />}
          />
          <SettingsRow
            icon={<UnreadOnlyIcon />}
            label='仅显示未读'
            actionElemnt={<Switch onChange={onToggleUnreadOnly} checked={unreadOnly} />}
          />
        </div>
        <div className={classes.sectionHeader}>列表布局</div>
        <RadioGroup className={classes.list} value={streamItemDisplayType} onChange={(e, data) => setStreamItemDisplayType(data.value as StreamItemDisplayType)}  >
          <Radio value="default" label="默认" labelPosition='after' className={mergeClasses(classes.listItem, classes.radio)} input={{ className: classes.radioInput }} />
          <Radio value="pictureOnBottom" label="社媒" labelPosition='after' className={mergeClasses(classes.listItem, classes.radio)} input={{ className: classes.radioInput }} />
        </RadioGroup>
        <div className={classes.sectionHeader}>详细设置</div>
        <div className={classes.list}>
          {NAV_LIST.map(({ key, name, desc, icon, url }) => (
            <SettingsRow
              key={key}
              icon={icon}
              label={name}
              actionElemnt={<Button appearance="transparent" icon={<ChevronRight20Regular />} onClick={() => router.push(url)} />}
            />
          ))}
        </div>
      </div>
    </HalfScreenModal>
  );
});

ArticleListSettingsModal.displayName = "ArticleListSettingsModal";
