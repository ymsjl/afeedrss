"use client";

import React, { useCallback } from "react";
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
  SlideGrid20Filled,
  SlideGrid20Regular,
} from "@fluentui/react-icons";
import { useAppStore } from "@/app/providers/app-store-provider";
import { StreamItemDisplayType } from "@/store/app-store";
import { useHomePageLayoutType } from "../page-client/use-home-page-layout-type";
import { useStateChangeEffect } from "@/utils/use-state-change-effect";
import { useLargeThenMobile } from "@/utils/use-large-then-mobile";

const ImageIcon = bundleIcon(Image20Filled, Image20Regular);
const GridIcon = bundleIcon(SlideGrid20Filled, SlideGrid20Regular);
const ListContentIcon = bundleIcon(AppsListDetail20Filled, AppsListDetail20Regular);

export const useArticleLayoutChangeEffect = () => {
  const homePageLayoutType = useHomePageLayoutType();
  const isLargeThenMobile = useLargeThenMobile()

  const streamItemDisplayType = useAppStore(store => store.streamItemDisplayType);
  const setStreamItemDisplayType = useAppStore((state) => state.setStreamItemDisplayType);

  const onHomePageLayoutTypeChange = useCallback((prevValue: string | undefined, currentValue: string | undefined) => {
    if (prevValue !== currentValue && currentValue === 'split' && streamItemDisplayType === 'grid') {
      setStreamItemDisplayType('default');
    }
  }, [streamItemDisplayType, setStreamItemDisplayType]);

  useStateChangeEffect(homePageLayoutType, onHomePageLayoutTypeChange);


  useStateChangeEffect(isLargeThenMobile, (prevValue, currentValue) => {
    if (prevValue !== currentValue && !currentValue) {
      setStreamItemDisplayType('default');
    }
  })
}

export const ArticleLayoutMenuButton: React.FC<ButtonProps> = (props) => {
  const classes = useClasses();
  const homePageLayoutType = useHomePageLayoutType();

  const streamItemDisplayType = useAppStore(
    (state) => state.streamItemDisplayType
  );

  const setStreamItemDisplayType = useAppStore(
    (state) => state.setStreamItemDisplayType
  );

  return (
    <TabList className={classes.root} selectedValue={streamItemDisplayType} size='small' onTabSelect={(_, { value }) => setStreamItemDisplayType(value as StreamItemDisplayType)}>
      <Tab className={classes.tab} icon={<ListContentIcon />} value='default' title='默认' />
      <Tab className={classes.tab} icon={<ImageIcon />} value='pictureOnBottom' title='社媒' />
      {homePageLayoutType !== 'split' && <Tab className={classes.tab} icon={<GridIcon />} value='grid' title='网格' />}
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