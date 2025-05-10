"use client";

import { useFeedNavTreeData } from "@/app/(main)/_components/feed-side-nav-panel/use-feed-nav-tree-data";
import React, { ComponentProps } from "react";
import { INavItem } from "./feed-nav-item.types";
import { FeedNavItem } from "./feed-nav-item";

interface FeedNavTreeProps {
  onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>, item: INavItem) => void;
}

export const FeedNavTree = React.memo(({ onClick, appearance }: FeedNavTreeProps & Pick<ComponentProps<typeof FeedNavItem>, 'appearance'>) => {
  const { data } = useFeedNavTreeData();
  return <>{data?.map((link) => <FeedNavItem key={link.key} link={link} onClick={onClick} appearance={appearance} />)}</>;
})

FeedNavTree.displayName = "FeedNavTree";