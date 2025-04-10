import React from "react";
import { signOut } from "next-auth/react";
import { Button } from "@fluentui/react-components";

export default function SignOut() {
  return (
    <div className="w-48 mx-auto mt-12">
      <p>确定要退出登录吗？</p>
      <Button onClick={() => signOut({callbackUrl: '/auth/signin'})}>退出登录</Button>
    </div>
  );
}
