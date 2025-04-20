import React, { useCallback } from "react";
import { Spinner, List, ListItem, mergeClasses, makeStyles } from "@fluentui/react-components";
import { StreamContentItem } from "@server/inoreader/stream.types";
import { StreamContentItemWithPageIndex, useStreamContentActions } from "@features/stream-content/use-stream-content-actions";
import { useStreamContentsQuery } from '@features/stream-content/use-stream-contents-query';
import StatusCard, { Status } from "@components/status-card";
import { useCommonClasses, useFlexClasses } from '@/theme/commonStyles';
import { useAppStore } from "@/app/providers/app-store-provider";
import ArticleListItem, { useListClasses } from "./steam-content-list-item";

interface StreamContentPanelProps {
  curArticleId: string | null;
  onStreamContentItemClick: (item: StreamContentItem) => void;
}

export function StreamContentPanel(props: StreamContentPanelProps) {
  const { curArticleId, onStreamContentItemClick } = props;
  const listClasses = useListClasses();
  const { markAboveAsRead, markItemAsRead } = useStreamContentActions();
  const { data: items, isFetching, isFetched, error } = useStreamContentsQuery();
  const showFeedThumbnail = useAppStore(store => store.preferences.showFeedThumbnail);

  const classes = useClasses();
  const commonClasses = useCommonClasses()
  const flexClasses = useFlexClasses()

  const onSelectArticle = useCallback(
    (item: StreamContentItemWithPageIndex) => {
      onStreamContentItemClick(item);
      if (!item.isRead) {
        markItemAsRead(item);
      }
    },
    [onStreamContentItemClick, markItemAsRead]
  );

  if (isFetched) {
    if (error) {
      return <StatusCard status={Status.ERROR} content="出错了" />;
    } else if (!items || items.length === 0) {
      return <StatusCard status={Status.EMPTY} content="这里是空的" />;
    }
  }

  return (
    <>
      <List className={listClasses.list}>
        {items.map((item) => {
          if (!item) return null;
          return (
            <ListItem key={item.id}>
              <ArticleListItem
                item={item}
                isSelected={curArticleId === item.id}
                showFeedThumbnail={showFeedThumbnail}
                onMarkAsRead={markItemAsRead}
                onMarkAboveAsRead={markAboveAsRead}
                onSelectArticle={onSelectArticle}
              />
            </ListItem>
          );
        })}
      </List >
      <div className={mergeClasses(flexClasses.flexCenter, commonClasses.w100, classes.spinnerContainer)}>
        {isFetching && <Spinner />}
      </div>
    </>
  );
}

const useClasses = makeStyles({
  spinnerContainer: {
    height: '400px',
  }
});