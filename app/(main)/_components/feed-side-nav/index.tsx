"use client";

import React from "react";
import { useLargeThenMobile } from "@utils/use-large-then-mobile";
import { FeedSideNavMobile } from "./feed-side-nav-mobile";
import { FeedSideNavDesktop } from "./feed-side-nav-desktop";
import { Props } from "./feed-side-nav.types";

export const FeedSideNav = React.memo(({ className }: Props) => {
  const isLargeThenMobile = useLargeThenMobile();
  if (!isLargeThenMobile) {
    return (<FeedSideNavMobile className={className} />)
  } else {
    return (<FeedSideNavDesktop className={className} />)
  }
})

FeedSideNav.displayName = "FeedSideNav";


