"use client";

import React from "react";
import { useLargeThenMobile } from "@utils/use-large-then-mobile";
import { FeedSideNavMobile } from "./feed-side-nav-mobile";
import { Props } from "./feed-side-nav.types";
import dynamic from 'next/dynamic';

const FeedSideNavDesktop = dynamic(()=>import('./feed-side-nav-desktop'))

export const FeedSideNav = React.memo(({ className }: Props) => {
  const isLargeThenMobile = useLargeThenMobile();
  if (!isLargeThenMobile) {
    return (<FeedSideNavMobile className={className} />)
  } else {
    return (<FeedSideNavDesktop className={className} />)
  }
})

FeedSideNav.displayName = "FeedSideNav";


