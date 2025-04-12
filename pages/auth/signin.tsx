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
import { useCommonClasses } from "../../theme/commonStyles";

interface Props {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
}

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

export default function SignIn({ providers }: Props) {
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
