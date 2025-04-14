"use client";

import React from "react";
import { signIn } from "next-auth/react";
import {
  Button,
  makeStyles,
  mergeClasses,
  tokens,
} from "@fluentui/react-components";
import { useTextClasses, useFlexClasses } from "../../../theme/commonStyles";
import Image from "next/image";
import { Planet } from "./planet";

const useStyles = makeStyles({
  container: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    width: "100vw",
    minHeight: "100vh",
    backgroundColor: tokens.colorNeutralBackground4,
  },
  authCard: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    gap: tokens.spacingVerticalL,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow16,
    paddingInline: tokens.spacingHorizontalXXXL,
    paddingBlockStart: tokens.spacingVerticalXXL,
    paddingBlockEnd: tokens.spacingVerticalXXXL,
    minHeight: "420px",
    minWidth: "350px",
  },
  middle: {
    paddingBlock: tokens.spacingVerticalXL,
  },
  title: {},
  button: {
    width: "100%",
  },
});

export default function SignIn() {
  const classes = useStyles();
  const textClasses = useTextClasses();
  const flexClassess = useFlexClasses();

  return (
    <div className={mergeClasses(classes.container, flexClassess.flexCenter)}>
      <div className={classes.authCard}>
        <div className={mergeClasses(classes.title, textClasses.textLg)}>
          登录
        </div>
        <div className={mergeClasses(flexClassess.flexGrow, flexClassess.flexCenter, classes.middle)}>
          <Planet />
        </div>
        <div>
          <Button
            appearance="primary"
            size="large"
            className={classes.button}
            icon={
              <Image
                src="/images/inoreader_logo_icon_white.svg"
                width={28}
                height={28}
                alt=""
              />
            }
            onClick={() => signIn("inoreader", { callbackUrl: "/" })}
          >
            登录 Inoreader 账号
          </Button>
        </div>
      </div>
    </div>
  );
}
