"use client";

import React, { Suspense } from "react";
import { makeStyles, tokens } from "@fluentui/react-components";

import { AppSideNav } from "../app-side-nav";
import { useLargeThenMobile } from "@/utils/use-large-then-mobile";

interface Props {
  children?: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const classes = useClasses();
  const isLargeThenMobile = useLargeThenMobile();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={classes.root}>
        {isLargeThenMobile ? <AppSideNav /> : null}
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
