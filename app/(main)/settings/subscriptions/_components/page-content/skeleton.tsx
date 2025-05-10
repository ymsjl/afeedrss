"use client";

import React from "react";
import { List, mergeClasses, ListItem, Skeleton, SkeletonItem } from "@fluentui/react-components";
import { useListClasses } from "@/app/(main)/_components/article-list-panel/article-list-item.style"
import { useClasses } from "../../useClasses";
import { useFlexClasses, useCommonClasses } from "@/theme/commonStyles";

export const SubscriptionPageContentSkeleton = React.memo(() => {
  const classes = useClasses();
  const listClasses = useListClasses();

  return (
    <List className={mergeClasses(listClasses.list, classes.tabContent)}>
      {Array(5).fill(null).map(
        (_, index) => <ListItem className={listClasses.listItem} key={index}>
          <ListItemSkeleton />
        </ListItem>
      )}
    </List>
  );
})

const ListItemSkeleton = React.memo(() => {
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
