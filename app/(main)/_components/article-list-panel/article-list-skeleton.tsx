import { List, ListItem, makeStyles, mergeClasses, Skeleton, SkeletonItem } from "@fluentui/react-components";
import { useListClasses } from "./article-list-item.style";
import { useClasses } from "./article-list-item.style";
import { useCommonClasses, useFlexClasses } from "@/theme/commonStyles";
import React from "react";

export const ArticleListSkeleton = React.memo(() => {
  const listClasses = useListClasses();
  return (
    <List className={listClasses.list}>
      {Array(5).fill(null).map((_, index) => (
        <ListItem className={listClasses.listItem} key={index}>
          <ArticleListItemSkeleton />
        </ListItem>
      ))}
    </List>
  )
})

export const ArticleListItemSkeleton = React.memo(() => {
  const classes = useClasses()
  const flexClasses = useFlexClasses()
  const commonClasses = useCommonClasses();
  const skeletonClasses = useSkeletonClasses();

  return (
    <Skeleton>
      <div className={mergeClasses(flexClasses.flexRow, commonClasses.spaceX4)}>
        <SkeletonItem className={mergeClasses(classes.thumbnail, flexClasses.flexDisableShrink, skeletonClasses.thumbnail)} />
        <div className={mergeClasses(flexClasses.flexGrow, commonClasses.spaceY2)}>
          <SkeletonItem />
          <SkeletonItem />
        </div>
      </div>
    </Skeleton>
  )
})

const useSkeletonClasses = makeStyles({
  thumbnail: {}
})