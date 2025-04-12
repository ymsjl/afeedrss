"use client";

import React, { Suspense } from "react";
import { tokens } from "@fluentui/react-components";
import { makeStyles } from "@fluentui/react-components";

import SourceNavPanel from "../SourceNavPanel";
import { GlobalNavigationCtxProvider } from "./GlobalNavigationCtx";

interface Props {
  children?: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const classes = useClasses();
  return (
    <GlobalNavigationCtxProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <div className={classes.root}>
          <SourceNavPanel />
          <div className={classes.mainContent}>
            <div className={classes.mainContentInner}>{children}</div>
          </div>
        </div>
      </Suspense>
    </GlobalNavigationCtxProvider>
  );
}

export const getLayout = (page: React.ReactElement): React.ReactElement => (
  <Layout>{page}</Layout>
);

const useClasses = makeStyles({
  root: {
    display: "flex",
    position: "relative",
    height: "100vh",
    overflow: "hidden",
    backgroundColor: tokens.colorNeutralBackground4,
  },
  mainContent: {
    display: "flex",
    justifyContent: "center",
    flexGrow: 1,
  },
  mainContentInner: {
    maxWidth: "64rem",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    paddingInlineEnd: tokens.spacingHorizontalL,
  },
});
