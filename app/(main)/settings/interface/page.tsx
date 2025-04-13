"use client";

import React from "react";
import { Label, Switch, SwitchOnChangeData } from "@fluentui/react-components";
import { StackShim, StackItemShim } from "@fluentui/react-migration-v8-v9";
import { useTextClasses } from "@/theme/commonStyles";
import { SettingsPageLayout } from "@/components/SettingsPageLayout";

import { GlobalSettingsCtx } from "@/app/providers/GlobalSettingProvider";

interface Props {}

function Interface({}: Props) {
  const textClasses = useTextClasses();
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
      <StackShim>
        <Label className={textClasses.textLg}>文章列表</Label>
        <StackShim horizontal verticalAlign="center">
          <StackItemShim grow>显示缩略图</StackItemShim>
          <Switch
            checked={globalSettings.showFeedThumbnail}
            onChange={handleOnShowFeedThumbnailToggleChange}
          />
        </StackShim>
      </StackShim>
    </SettingsPageLayout>
  );
}

export default Interface;
