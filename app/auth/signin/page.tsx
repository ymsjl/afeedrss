"use client";

import React from "react";
import { ClientSafeProvider, LiteralUnion, signIn } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers";
import Image from "next/image";
import { StackShim, StackItemShim } from "@fluentui/react-migration-v8-v9";
import { Button, makeStyles } from "@fluentui/react-components";
import { useCommonClasses } from "../../../theme/commonStyles";

const useStyles = makeStyles({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    minHeight: "100vh",
    backgroundColor: "var(--colorNeutralBackground2)",
  },
  authCard: {
    backgroundColor: "var(--colorNeutralBackground1)",
    borderRadius: "8px",
    boxShadow: "var(--shadow8)",
    padding: "48px",
  },
});

export default function SignIn() {
  const classes = useStyles();
  const commonStyles = useCommonClasses();
  
  return (
    <StackShim
      className={classes.container}
      horizontalAlign="center"
      verticalAlign="center"
    >
      <StackShim
        className={classes.authCard}
        horizontalAlign="center"
      >
        <StackItemShim className={commonStyles.mb4} disableShrink>
          <Image
            src="/images/3d-fluency-airplane-take-off.png"
            width={200}
            height={200}
            alt=""
            objectFit="contain"
          />
        </StackItemShim>
        <div>
          <Button
            appearance="primary"
            onClick={() => signIn("inoreader", { callbackUrl: "/" })}
          >
            登录 Inoreader 账号
          </Button>
        </div>
      </StackShim>
    </StackShim>
  );
}