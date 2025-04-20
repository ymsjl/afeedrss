"use client";

import { useFlexClasses, useCommonClasses } from "@/theme/commonStyles";
import { Skeleton, mergeClasses, SkeletonItem } from "@fluentui/react-components";
import React from "react";
import { useClasses } from "../useClasses";

export const ListItemSkeleton = React.memo(() => {
  const classes = useClasses();
  const flexClasses = useFlexClasses();
  const commonClasses = useCommonClasses();

  return (
    <Skeleton className={commonClasses.spaceY2}>
      <div className={mergeClasses(flexClasses.flexRow, commonClasses.spaceX2)}>
        <SkeletonItem shape="circle" className={flexClasses.flexDisableShrink} size={20} />
        <SkeletonItem className={mergeClasses(classes.listItemSkeleton, flexClasses.flexGrow)} size={20} />
      </div>
      <SkeletonItem className={classes.listItemSkeleton} size={16} />
    </Skeleton>
  );
})
