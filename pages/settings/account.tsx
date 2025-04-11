import React from "react";
import { Button } from "@fluentui/react-components";
import { signOut } from "next-auth/react";
import SettingsLayout from "../../components/settings/layout";
import { getLayout } from "../../components/home/layout";
import { ArrowImportRegular } from "@fluentui/react-icons";

interface Props {}

function Account({}: Props) {
  const onClickSignout = () => {
    signOut({ callbackUrl: "/auth/signin" });
  };
  return (
    <SettingsLayout
      title="账户"
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
    ></SettingsLayout>
  );
}

Account.getLayout = getLayout;

export default Account;
