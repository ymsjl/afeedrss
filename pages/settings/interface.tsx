import React from "react";
import { Label, Switch, SwitchOnChangeData } from "@fluentui/react-components";
import { StackShim, StackItemShim } from "@fluentui/react-migration-v8-v9";

import { GlobalSettingsCtx } from "./../_app";
import SettingsLayout from "../../components/settings/layout";
import { getLayout } from "../../components/home/layout";

interface Props {}

function Interface({}: Props) {
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
    <SettingsLayout title="界面">
      <StackShim>
        <Label className="text-lg">文章列表</Label>
        <StackShim horizontal verticalAlign="center">
          <StackItemShim grow >显示缩略图</StackItemShim>
          <Switch
            checked={globalSettings.showFeedThumbnail}
            onChange={handleOnShowFeedThumbnailToggleChange}
          />
        </StackShim>
      </StackShim>
    </SettingsLayout>
  );
}

Interface.getLayout = getLayout;

export default Interface;
