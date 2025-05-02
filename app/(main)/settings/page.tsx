"use client";

import React from "react";
import Link from "next/link";
import {
  Text,
  makeStyles,
  mergeClasses,
  tokens,
} from "@fluentui/react-components";
import { SettingsPageLayout } from "@/app/(main)/settings/_components/settings-page-layout";
import {
  ChevronRight20Regular,
} from "@fluentui/react-icons";
import { useFlexClasses, useTextClasses } from "@/theme/commonStyles";
import { useListClasses } from "../_components/stream-content-panel/stream-content-list-item.style";
import { NAV_LIST } from "./NAV_LIST";

export interface NavListItem {
  key: string;
  name: string;
  desc?: string;
  icon?: React.ReactNode;
  url: string;
}

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
