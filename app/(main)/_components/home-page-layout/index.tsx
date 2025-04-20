"use client";

import React, { Suspense } from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
import { useMediaQuery } from "@reactuses/core";

import { AppSideNav } from "../app-side-nav";
import { AppTabBar } from "../app-tab-bar";

interface Props {
  children?: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const classes = useClasses();
  const isWide = useMediaQuery("(min-width: 480px)", true);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={classes.root}>
        {isWide ? <AppSideNav /> : <AppTabBar />}
        {children}
      </div>
    </Suspense>
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
