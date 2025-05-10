"use client";

import React, { Suspense } from "react";

import { AppSideNav } from "../app-side-nav";
import { useLargeThenMobile } from "@/utils/use-large-then-mobile";
import { useClasses } from "./page-layout.styles";
import { mergeClasses } from "@fluentui/react-components";
import { useFlexClasses } from "@/theme/commonStyles";

interface Props {
  children?: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const classes = useClasses();
  const flexClasses = useFlexClasses();
  const isLargeThenMobile = useLargeThenMobile();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={mergeClasses(classes.root, flexClasses.headerBodyRow)}>
        {isLargeThenMobile ? <AppSideNav /> : null}
        {children}
      </div>
    </Suspense>
  );
}

