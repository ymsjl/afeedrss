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
import { useFlexClasses, useTextClasses } from "@/theme/commonStyles";
import { SettingsPageLayout } from "@/components/SettingsPageLayout";

import { GlobalSettingsCtx } from "@/app/providers/GlobalSettingProvider";
import { useListClasses } from "@/components/StreamContentPanel/ArticleListItem";

interface Props {}

function Interface({}: Props) {
  const classes = useClasses();
  const flexClasses = useFlexClasses();
  const listClasses = useListClasses();
  
  const { globalSettings, setGlobalSettings } =
    React.useContext(GlobalSettingsCtx);

  const handleOnShowFeedThumbnailToggleChange = (
    ev: React.ChangeEvent<HTMLInputElement>,
    { checked }: SwitchOnChangeData
  ) => {
    setGlobalSettings((prevState) => ({
      ...prevState,
      showFeedThumbnail: Boolean(checked),
    }));
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
              checked={globalSettings.showFeedThumbnail}
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