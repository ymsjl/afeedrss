import React from "react";
import { signOut } from "next-auth/react";
import { Button, makeStyles, tokens } from "@fluentui/react-components";

export default function SignOut() {
  const classes = useClasses();
  return (
    <div className={classes.root}>
      <p>确定要退出登录吗？</p>
      <Button onClick={() => signOut({ callbackUrl: "/auth/signin" })}>
        退出登录
      </Button>
    </div>
  );
}

const useClasses = makeStyles({
  root: {
    width: tokens.spacingHorizontalXXXL,
    marginInline: "auto",
    marginBlockStart: tokens.spacingVerticalXXL,
  },
});
