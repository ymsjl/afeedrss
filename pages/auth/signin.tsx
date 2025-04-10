import React from "react";
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from "next-auth/react";
import { GetServerSideProps } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import Image from "next/image";
import { StackShim, StackItemShim } from "@fluentui/react-migration-v8-v9";
import { Button, makeStyles } from "@fluentui/react-components";

interface Props {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    minHeight: "100vh",
  },
  content: {
    width: "100%",
    height: "100%",
    position: "relative",
    overflowX: "hidden",
  },
});

export default function SignIn({ providers }: Props) {
  const classes = useStyles();
  return (
    <StackShim
      className="w-screen min-h-screen bg-gray-100 "
      horizontalAlign="center"
      verticalAlign="center"
    >
      <StackShim
        className="rounded-lg bg-gray-50 shadow-lg p-12"
        horizontalAlign="center"
      >
        <StackItemShim className="mb-4" disableShrink>
          <Image
            src="/images/3d-fluency-airplane-take-off.png"
            width={200}
            height={200}
            alt=""
            objectFit="contain"
          />
        </StackItemShim>
        {providers &&
          Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <Button
                appearance="primary"
                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              >
                {`登录 ${provider.name} 账号`}
              </Button>
            </div>
          ))}
      </StackShim>
    </StackShim>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
