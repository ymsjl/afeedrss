"use client";

import React from "react";
import { signIn } from "next-auth/react";
import {
  Button,
  Text,
  makeStyles,
  mergeClasses,
  tokens,
} from "@fluentui/react-components";
import { useTextClasses, useFlexClasses } from "../../../theme/commonStyles";
import Image from "next/image";
import { Planet } from "./planet";
import { appTokens } from "@/theme/tokens";

const useStyles = makeStyles({
  container: {
    display: "flex",
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
    paddingInline: tokens.spacingHorizontalXXXL,
    paddingBlockStart: tokens.spacingVerticalXXL,
    paddingBlockEnd: tokens.spacingVerticalXXXL,
    flex: '1',
    height: '100%',
    minWidth: "350px",
    [appTokens.breakpoints.medium]: {
      flex: 'unset',
      backgroundColor: tokens.colorNeutralBackground1,
      borderRadius: tokens.borderRadiusXLarge,
      marginBlockStart: "24vh",
      border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
      minHeight: "420px",
    },
  },
  middle: {
    paddingBlock: tokens.spacingVerticalXL,
  },
  title: {
    textAlign: 'center'
  },
  button: {
    width: "100%",
  },
});

export default function SignIn() {
  const classes = useStyles();
  const textClasses = useTextClasses();
  const flexClassess = useFlexClasses();

  return (
    <div className={mergeClasses(classes.container)}>
      <div className={classes.authCard}>
        <Text className={mergeClasses(classes.title)} size={400}>登录</Text>
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
