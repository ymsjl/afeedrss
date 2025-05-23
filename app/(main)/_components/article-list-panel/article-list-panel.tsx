"use client";
import React, { Suspense, useMemo } from "react";
import { StreamContentQueryKeyProvider } from "@/features/stream-content/stream-content-query-key-context";
import { useCommonClasses, useFlexClasses } from "@/theme/commonStyles";
import { useLargeThenMobile } from "@/utils/use-large-then-mobile";
import { Body1Strong, Divider, mergeClasses } from "@fluentui/react-components";
import { ArticleLayoutMenuButton, useArticleLayoutChangeEffect } from "../article-layout-menu-button";
import { LayoutToggleButton } from "../layout-toggle-button";
import { RefreshButton } from "../refresh-button";
import { ArticleList } from "./article-list";
import { ArticleListSkeleton } from "./article-list-skeleton";
import { ThemeToggleButton } from "../theme-toggle-button";
import { UnreadOnlyToggleButton } from "../unread-only-toggle-button";
import { ArticleListScrollLayout } from "./article-list-scroll-layout";
import { ActionsBarLayout, useActionBarLayoutClasses } from '../actions-bar-layout';
import { useSearchParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { folderQueryOptions, subscriptionsQueryOptions } from "@/services/subscription/subscription.rquery";
import { getTagNameFromId } from "@/features/subscription-source/utils";

interface ArticleListPanelProps {
  className?: string;
  streamContentQueryKey?: string[];
}

export const ArticleListPanel: React.FC<ArticleListPanelProps> = ({ className, streamContentQueryKey }) => {
  const isLargeThenMobile = useLargeThenMobile();
  const commonClasses = useCommonClasses();
  const flexClasses = useFlexClasses();
  const actionBarLayoutClasses = useActionBarLayoutClasses();

  useArticleLayoutChangeEffect();

  const articleListToolbar = isLargeThenMobile && (
    <ActionsBarLayout sticky>
      <Suspense fallback={null}>
        <StreamTitle />
      </Suspense>
      <div className={flexClasses.flexGrow} />
      <ThemeToggleButton />
      <Divider vertical className={actionBarLayoutClasses.divider} />
      <ArticleLayoutMenuButton />
      <LayoutToggleButton />
      <Divider vertical className={actionBarLayoutClasses.divider} />
      <UnreadOnlyToggleButton />
      <RefreshButton />
    </ActionsBarLayout>
  );

  return (
    <ArticleListScrollLayout
      className={mergeClasses(
        className,
        flexClasses.headerBodyColumn,
        commonClasses.fullHeightScrollHideScrollbar
      )}
    >
      {articleListToolbar}
      <StreamContentQueryKeyProvider initValue={streamContentQueryKey}>
        <Suspense fallback={<ArticleListSkeleton />}>
          <ArticleList />
        </Suspense>
      </StreamContentQueryKeyProvider>
    </ArticleListScrollLayout>
  );
};


const StreamTitle: React.FC = () => {
  const folderQuery = useSuspenseQuery(folderQueryOptions);
  const subscriptionsQuery = useSuspenseQuery(subscriptionsQueryOptions);
  const searchParams = useSearchParams();
  const streamId = searchParams.get("streamId")
  const unreadOnly = searchParams.get("unreadOnly") === 'true'
  const subscriptionsData = subscriptionsQuery.data;
  const folderData = folderQuery.data;
  const streamTitle = useMemo(() => {
    let result = unreadOnly ? "未读文章" : "全部文章";

    if (streamId && subscriptionsData && folderData) {
      const subscriptionsById = subscriptionsData?.entities?.subscription ?? {}
      const foldsById = folderData?.entities?.folder ?? {}
      if (streamId in subscriptionsById) {
        result = subscriptionsById[streamId]?.title
      } else if (streamId in foldsById) {
        result = getTagNameFromId(foldsById[streamId]?.id)
      }
    }

    return result
  }, [unreadOnly, streamId, subscriptionsData && folderData]);

  return (
    <Body1Strong>{streamTitle}</Body1Strong>
  )
}