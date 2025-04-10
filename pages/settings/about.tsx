import React from "react";
import { Image, Text, makeStyles } from "@fluentui/react-components";
import SettingsLayout from "../../components/settings/layout";
import { getLayout } from "../../components/home/layout";

interface Props {}

const useStyles = makeStyles({
  root: {},
});

function Account({}: Props) {
  const classes = useStyles();
  return (
    <SettingsLayout title="关于">
      <div className={classes.root}>
        <Image
          src="/images/3d-fluency-newspaper.png"
          className="w-24 h-24"
          alt=""
        />
        <Text className="font-semibold text-lg" block>
          Afeedrss 1.0.0
        </Text>
        <Text className="text-base" block>
          © {new Date().getFullYear()} 要没时间了。
        </Text>
        <a
          className="text-blue-600 hover:underline"
          href="https://github.com/uwpdver/afeedrss"
          target="_blank"
          rel="noreferrer"
        >
          项目仓库
        </a>
        <a className="text-blue-600 hover:underline" title="">
          使用条款
        </a>
        <a className="text-blue-600 hover:underline" title="">
          隐私策略
        </a>
      </div>
    </SettingsLayout>
  );
}

Account.getLayout = getLayout;

export default Account;
