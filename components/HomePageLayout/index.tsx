"use client";

import React, { Suspense } from "react";
import { shorthands, tokens } from "@fluentui/react-components";
import { makeStyles } from "@fluentui/react-components";

import AppNav from "../AppNav";
import { GlobalNavigationCtxProvider } from "./GlobalNavigationCtx";
import { useMediaQuery } from "@reactuses/core";
import { TabBar } from "../AppNav/TabBar";

interface Props {
  children?: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const classes = useClasses();
  const isWide = useMediaQuery("(min-width: 480px)", true);
  return (
    <GlobalNavigationCtxProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <div className={classes.root}>
          {isWide ? <AppNav /> : <TabBar />}
          {children}
        </div>
      </Suspense>
    </GlobalNavigationCtxProvider>
  );
}

const useClasses = makeStyles({
  root: {
    display: "flex",
    position: "relative",
    height: "100vh",
    overflow: "hidden",
    backgroundColor: tokens.colorNeutralBackground4,
  },
});
