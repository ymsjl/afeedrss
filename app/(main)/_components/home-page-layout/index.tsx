"use client";

import React, { Suspense } from "react";

import { AppSideNav } from "../app-side-nav";
import { useLargeThenMobile } from "@/utils/use-large-then-mobile";
import { useClasses } from "./home-page-layout.styles";

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

