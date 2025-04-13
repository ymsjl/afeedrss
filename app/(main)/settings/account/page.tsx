"use client";

import React from "react";
import { Button } from "@fluentui/react-components";
import { signOut } from "next-auth/react";
import { ArrowImportRegular } from "@fluentui/react-icons";
import { SettingsPageLayout } from "@/components/SettingsPageLayout";

interface Props {}

export default function Account({}: Props) {
  const onClickSignout = () => signOut({ callbackUrl: "/auth/signin" });

  return (
    <SettingsPageLayout
      breadcrumbItems={[
        {
          title: "账户",
          key: "account",
          href: "/settings/account",
        },
      ]}
      tailElem={
        <Button
          onClick={onClickSignout}
          icon={<ArrowImportRegular />}
          iconPosition="after"
        >
          退出登录
        </Button>
      }
    ></SettingsPageLayout>
  );
}
