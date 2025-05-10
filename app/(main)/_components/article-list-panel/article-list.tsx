import React, { useCallback } from "react";
import { Spinner, mergeClasses, makeStyles, Divider, tokens } from "@fluentui/react-components";
import { useStreamContentActions } from "@features/stream-content/use-stream-content-actions";
import { StreamContentItemWithPageIndex } from "@/features/stream-content/use-stream-contents-query";
import { useStreamContentsQuery } from '@features/stream-content/use-stream-contents-query';
import StatusCard, { Status } from "@components/status-card";
import { useCommonClasses, useFlexClasses } from '@/theme/commonStyles';
import ArticleListItem from "./article-list-item";
import { useListClasses } from "./article-list-item.style";
import { useArticleReadPanelControl } from "../article-read-panel/article-read-panel-control-context";
import { useAppStore } from "@/app/providers/app-store-provider";

interface ArticleListProps { }

export function ArticleList(props: ArticleListProps) {
  const listClasses = useListClasses();
  const { markAboveAsRead, markItemAsRead, markItemAsStar } = useStreamContentActions();
  const { data: items, isFetching, isFetched, error } = useStreamContentsQuery();
  const classes = useClasses();
  const commonClasses = useCommonClasses()
  const flexClasses = useFlexClasses()
  const { openArticlePanel } = useArticleReadPanelControl();
  const getArticleIsSelected = useAppStore(store => store.getArticleIsSelected)
  const onSelectArticle = useCallback(
    (item: StreamContentItemWithPageIndex, index: number) => {
      openArticlePanel(item, index);
      if (!item.isRead) {
        markItemAsRead(item);
      }
    },
    [openArticlePanel, markItemAsRead]
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
      <ul className={listClasses.list}>
        {items.map((item, index) => {
          if (!item) return null;
          return (
            <li key={item.id}>
              <ArticleListItem
                item={item}
                isSelected={getArticleIsSelected(item.id)}
                onMarkAsRead={markItemAsRead}
                onMarkAsStar={markItemAsStar}
                onMarkAboveAsRead={markAboveAsRead}
                onSelectArticle={(article) => onSelectArticle(article, index)}
              />
            </li>
          );
        })}
      </ul>
      <div className={mergeClasses(flexClasses.flexCenter, commonClasses.w100, classes.spinnerContainer)}>
        {isFetching && <Spinner />}
      </div>
      <Divider className={classes.divider}>完</Divider>
    </>
  );
}

const useClasses = makeStyles({
  spinnerContainer: {
    height: '400px',
  },
  divider: {
    paddingBlockStart: tokens.spacingVerticalXXXL,
    paddingBlockEnd: '80px',
    marginInline: tokens.spacingHorizontalL,
    width: 'auto'
  },
});