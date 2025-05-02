"use client";

import React from "react";
import {
  Label,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { SettingsPageLayout } from "@/app/(main)/settings/_components/settings-page-layout";


interface Props { }

function Interface({ }: Props) {
  const classes = useClasses();
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