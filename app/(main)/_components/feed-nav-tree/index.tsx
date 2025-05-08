"use client";

import { useFeedSideNavData } from "@/features/subscription-source/use-feed-side-nav-data";
import React, { ComponentProps } from "react";
import { INavItem } from "../feed-side-nav/create-nav";
import { FeedNavItem } from "./feed-nav-item";

export const FeedNavTree = React.memo(({ onClick, itemClassName }: { onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>, item: INavItem) => void; } & Pick<ComponentProps<typeof FeedNavItem>, 'itemClassName'>) => {
  const { data } = useFeedSideNavData();
  return <>{data?.map((link) => <FeedNavItem key={link.key} link={link} onClick={onClick} itemClassName={itemClassName} />)}</>;
})

FeedNavTree.displayName = "FeedNavTree";