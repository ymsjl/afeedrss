"use client";
import { StreamContentQueryKeyProvider } from "@/features/stream-content/stream-content-query-key-context";
import { useCommonClasses, useFlexClasses } from "@/theme/commonStyles";
import { useLargeThenMobile } from "@/utils/use-large-then-mobile";
import { mergeClasses } from "@fluentui/react-components";
import React, { Suspense } from "react";
import { ArticleLayoutMenuButton } from "../article-layout-menu-button";
import { LayoutToggleButton } from "../layout-toggle-button";
import { RefreshButton } from "../refresh-button";
import { ArticleList } from "./article-list";
import { ArticleListSkeleton } from "./article-list-skeleton";
import { ThemeToggleButton } from "../theme-toggle-button";
import { UnreadOnlyToggleButton } from "../unread-only-toggle-button";
import { ArticleListScrollLayout } from "./article-list-scroll-layout";
import { ActionsBarLayout } from '../actions-bar-layout';

interface ArticleListPanelProps {
  className?: string;
  streamContentQueryKey?: string[];
}

export const ArticleListPanel: React.FC<ArticleListPanelProps> = ({ className, streamContentQueryKey }) => {
  const isLargeThenMobile = useLargeThenMobile();
  const commonClasses = useCommonClasses();
  const flexClasses = useFlexClasses();

  const articleListToolbar = isLargeThenMobile && (
    <ActionsBarLayout sticky>
      <ArticleLayoutMenuButton />
      <LayoutToggleButton />
      <ThemeToggleButton />
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
          <ArticleList/>
        </Suspense>
      </StreamContentQueryKeyProvider>
    </ArticleListScrollLayout>
  );
};
