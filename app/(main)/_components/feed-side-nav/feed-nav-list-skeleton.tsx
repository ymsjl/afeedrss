"use client";
import { Skeleton, SkeletonItem } from "@fluentui/react-components";
import React from "react";
import { useClasses } from "./feed-side-nav.style";

export const FeedNavListSkeleton = React.memo(() => {
  const classes = useClasses();
  return (
    <>
      {Array(5).fill(null).map((_, index) => <Skeleton aria-label="Loading Content" key={index} className={classes.skeleton}>
        <SkeletonItem className={classes.skeletonItem} />
      </Skeleton>
      )}
    </>
  );
})

FeedNavListSkeleton.displayName = "FeedNavListSkeleton";