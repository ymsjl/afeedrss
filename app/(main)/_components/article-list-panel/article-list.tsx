import React, { useCallback } from "react";
import { Spinner, mergeClasses, makeStyles, Divider, tokens, createPresenceComponent, motionTokens } from "@fluentui/react-components";
import { useStreamContentActions } from "@features/stream-content/use-stream-content-actions";
import { StreamContentItemWithPageIndex } from "@/features/stream-content/use-stream-contents-query";
import { useStreamContentsQuery } from '@features/stream-content/use-stream-contents-query';
import { StatusCard, Status } from "@components/status-card";
import { useCommonClasses, useFlexClasses } from '@/theme/commonStyles';
import ArticleListItem from "./article-list-item";
import { useListClasses } from "./article-list-item.style";
import { useArticleReadPanelControl } from "../article-read-panel";
import { useAppStore } from "@/app/providers/app-store-provider";

interface ArticleListProps { }

const initialStyles = {
  opacity: 0,
  transform: "translate3D(0, 40px, 0)",
}

const endStyles = {
  opacity: 1,
  transform: "translate3D(0, 0, 0)",
}

const useAnimatedListItemClasses = makeStyles({
  listItem: initialStyles
})

const ListItemFadeIn = createPresenceComponent<{ delay?: number }>(({ delay = 0 }) => {
  const keyframes = [
    initialStyles,
    endStyles,
  ];

  return {
    enter: {
      keyframes,
      duration: motionTokens.durationNormal,
      easing: motionTokens.curveDecelerateMin,
      delay,
    },
    exit: {
      keyframes: [...keyframes].reverse(),
      duration: motionTokens.durationSlow,
      easing: motionTokens.curveAccelerateMin,
    },
  };
})

export function ArticleList(props: ArticleListProps) {
  const listClasses = useListClasses();
  const animatedListItemClasses = useAnimatedListItemClasses();
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
            <ListItemFadeIn appear visible key={item.id} delay={Math.min(12, index) * 40}>
              <li key={item.id} className={animatedListItemClasses.listItem}>
                <ArticleListItem
                  item={item}
                  isSelected={getArticleIsSelected(item.id)}
                  onMarkAsRead={markItemAsRead}
                  onMarkAsStar={markItemAsStar}
                  onMarkAboveAsRead={markAboveAsRead}
                  onSelectArticle={(article) => onSelectArticle(article, index)}
                />
              </li>
            </ListItemFadeIn>
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