"use client";

import React from "react";
import {
  ButtonProps,
  makeStyles,
  Tab,
  TabList,
  tokens,
} from "@fluentui/react-components";
import {
  bundleIcon,
  Image20Filled,
  Image20Regular,
  AppsListDetail20Filled,
  AppsListDetail20Regular,
} from "@fluentui/react-icons";
import { useAppStore } from "@/app/providers/app-store-provider";
import { StreamItemDisplayType } from "@/store/app-store";

const ImageIcon = bundleIcon(Image20Filled, Image20Regular);

const ListContentIcon = bundleIcon(AppsListDetail20Filled, AppsListDetail20Regular);

export const ArticleLayoutMenuButton: React.FC<ButtonProps> = (props) => {
  const classes = useClasses();

  const streamItemDisplayType = useAppStore(
    (state) => state.streamItemDisplayType
  );
  const setStreamItemDisplayType = useAppStore(
    (state) => state.setStreamItemDisplayType
  );

  return (
    <TabList className={classes.root} selectedValue={streamItemDisplayType} size='small' onTabSelect={(_, { value }) => setStreamItemDisplayType(value as StreamItemDisplayType)}>
      <Tab className={classes.tab} icon={<ListContentIcon />} value='default' title='默认' />
      <Tab className={classes.tab} icon={<ImageIcon />} value='pictureOnBottom' title='大图' />
    </TabList>
  )
};

ArticleLayoutMenuButton.displayName = "ArticleLayoutMenuButton";


const useClasses = makeStyles({
  root: {
    display: "inline-flex",
    backgroundColor: tokens.colorNeutralBackground1Selected,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalXXS,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
  },
  tab: {
    backgroundColor: 'transparent',
    borderRadius: tokens.borderRadiusSmall,
    padding: '3px',
    "[aria-selected='true']": {
      backgroundColor: tokens.colorNeutralBackground2,
      boxShadow: tokens.shadow4,
    }
  }
})