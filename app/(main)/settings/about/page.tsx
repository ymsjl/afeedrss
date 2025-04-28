"use client";

import React from "react";
import { Image, Text, makeStyles } from "@fluentui/react-components";
import { SettingsPageLayout } from "@/app/(main)/settings/_components/settings-page-layout";
import { useTextClasses } from "@/theme/commonStyles";

interface Props {}

export default function Account({}: Props) {
  const classes = useClasses();
  const textClasses = useTextClasses();

  return (
    <SettingsPageLayout
      breadcrumbItems={[
        {
          title: "关于",
          key: "about",
          href: "/settings/about",
        },
      ]}
    >
      <div className={classes.root}>
        <Image
          src="/images/3d-fluency-newspaper.png"
          className={classes.image}
          alt=""
        />
        <Text
          className={`${textClasses.textLg} ${textClasses.fontSemibold}`}
          block
        >
          Afeedrss 1.0.0
        </Text>
        <Text className={textClasses.textBase} block>
          © {new Date().getFullYear()} 要没时间了。
        </Text>
        <a
          className={classes.link}
          href="https://github.com/uwpdver/afeedrss"
          target="_blank"
          rel="noreferrer"
        >
          项目仓库
        </a>
        <a className={classes.link}>使用条款</a>
        <a className={classes.link}>隐私策略</a>
      </div>
    </SettingsPageLayout>
  );
}

const useClasses = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  link: {
    color: "var(--colorBrandBackground)",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  image: {
    width: "96px",
    height: "96px",
  },
});
