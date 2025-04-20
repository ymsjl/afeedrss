"use client";

import React from "react";
import { List, mergeClasses, ListItem } from "@fluentui/react-components";
import { useListClasses } from "@/components/stream-content-panel/article-list-item";
import { ListItemSkeleton } from "./ListItemSkeleton";
import { useClasses } from "../useClasses";
import { SubscriptionTabList } from "./SubscriptionTabList";

export const SubscriptionSkeleton = React.memo(() => {
  const classes = useClasses();
  const listClasses = useListClasses();

  return (
    <>
      <SubscriptionTabList />
      <List className={mergeClasses(listClasses.list, classes.tabContent)}>
        {Array(5).fill(null).map(
          (_, index) => <ListItem className={listClasses.listItem} key={index}>
            <ListItemSkeleton />
          </ListItem>
        )}
      </List>
    </>
  );
})
