import React, { useCallback, useContext, useMemo } from "react";
import { Spinner, List, ListItem, mergeClasses, makeStyles } from "@fluentui/react-components";
import { StreamContentItem } from "@server/inoreader";
import {
  StreamContentItemWithPageIndex,
  useStreamContentQuery,
  useStreamItemAction,
} from "./useStreamContent";
import { GlobalSettingsCtx } from "@/app/providers/GlobalSettingProvider";
import StatusCard, { Status } from "../StatusCard";
import ArticleListItem, { useListClasses } from "./ArticleListItem";
import { useCommonClasses, useFlexClasses } from '@/theme/commonStyles';

interface StreamContentPanelProps {
  curArticleId: string | null;
  onStreamContentItemClick: (item: StreamContentItem) => void;
}

export function StreamContentPanel(props: StreamContentPanelProps) {
  const { curArticleId, onStreamContentItemClick } = props;
  const listClasses = useListClasses();
  const streamContentQuery = useStreamContentQuery();
  const { markAboveAsRead, markItemAsRead } = useStreamItemAction();
  const {
    globalSettings: { showFeedThumbnail },
  } = useContext(GlobalSettingsCtx);

  const classes = useClasses();
  const commonClasses = useCommonClasses()
  const flexClasses = useFlexClasses()

  const queryData = streamContentQuery.data;
  const items = useMemo(() => {
    if (!queryData || !queryData.pages) {
      return [];
    }

    return queryData.pages.reduce(
      (acc, cur, pageIndex) =>
        acc.concat(cur.items.map((item) => ({ ...item, pageIndex }))),
      [] as StreamContentItemWithPageIndex[]
    );
  }, [queryData]);

  const onSelectArticle = useCallback(
    (item: StreamContentItemWithPageIndex) => {
      onStreamContentItemClick(item);
      if (!item.isRead) {
        markItemAsRead(item);
      }
    },
    [onStreamContentItemClick, markItemAsRead]
  );

  if (streamContentQuery.isFetched) {
    if (streamContentQuery.error) {
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
      </List>
      <div className={mergeClasses(flexClasses.flexCenter, commonClasses.w100, classes.spinnerContainer)}>
        {streamContentQuery.isFetching && <Spinner />}
      </div>
    </>
  );
}

const useClasses = makeStyles({
  spinnerContainer: {
    height: '400px',
  }
});