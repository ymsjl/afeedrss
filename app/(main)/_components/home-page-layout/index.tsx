"use client";

import React, { Suspense } from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
import { useMediaQuery } from "@reactuses/core";
import { breakpointQuerys } from '@/theme/tokens';

import { AppSideNav } from "../app-side-nav";
import { AppTabBar } from "../app-tab-bar";
import { useAppStore } from "@/app/providers/app-store-provider";

interface Props {
  children?: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const classes = useClasses();
  const isMobileSSR = useAppStore(store => store.isMobileSSR);
  const isWide = useMediaQuery(breakpointQuerys.medium, !isMobileSSR);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={classes.root}>
        {isWide ? <AppSideNav /> : null}
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
