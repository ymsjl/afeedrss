"use client";

import React, { Suspense } from "react";
import { shorthands, tokens } from "@fluentui/react-components";
import { makeStyles } from "@fluentui/react-components";

import AppNav from "../AppNav";
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
          <AppNav />
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
