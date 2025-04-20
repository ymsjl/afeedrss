"use client";

import React from "react";
import {
  Label,
  List,
  ListItem,
  makeStyles,
  mergeClasses,
  Switch,
  SwitchOnChangeData,
  Text,
  tokens,
} from "@fluentui/react-components";
import { useFlexClasses } from "@/theme/commonStyles";
import { SettingsPageLayout } from "@/components/settings-page-layout";

import { useListClasses } from "@/components/stream-content-panel/article-list-item";
import { useAppStore } from "@/app/providers/app-store-provider";

interface Props { }

function Interface({ }: Props) {
  const classes = useClasses();
  const flexClasses = useFlexClasses();
  const listClasses = useListClasses();

  const showFeedThumbnail = useAppStore(store => store.preferences.showFeedThumbnail)
  const setPreference = useAppStore(store => store.setPreference)

  const handleOnShowFeedThumbnailToggleChange = (
    ev: React.ChangeEvent<HTMLInputElement>,
    { checked }: SwitchOnChangeData
  ) => {
    setPreference('showFeedThumbnail', Boolean(checked));
  };

  return (
    <SettingsPageLayout
      breadcrumbItems={[
        {
          title: "界面",
          key: "interface",
          href: "/settings/interface",
        },
      ]}
    >
      <div>
        <Label className={classes.label} size='large'>文章列表</Label>
        <List className={listClasses.list}>
          <ListItem
            className={mergeClasses(
              listClasses.listItem,
              flexClasses.flexRow,
              flexClasses.itemsCenter
            )}
          >
            <Text className={flexClasses.flexGrow}>显示缩略图</Text>
            <Switch
              checked={showFeedThumbnail}
              onChange={handleOnShowFeedThumbnailToggleChange}
            />
          </ListItem>
        </List>
      </div>
    </SettingsPageLayout>
  );
}

export default Interface;

const useClasses = makeStyles({
  label: {
    display: 'block',
    marginInline: tokens.spacingVerticalS,
    marginBlockEnd: tokens.spacingVerticalM,
  },
});