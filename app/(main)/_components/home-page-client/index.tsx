"use client";

import React, { useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  mergeClasses,
  Button,
  Text,
  Title3,
} from "@fluentui/react-components";
import { StreamContentQueryKeyProvider } from "@/features/stream-content/stream-content-query-key-context";

import { StreamContentPanel } from "@/app/(main)/_components/stream-content-panel";
import { StreamContentPanelSkeleton } from "@/app/(main)/_components/stream-content-panel/stream-content-panel-skeleton";
import { ArticleReadPanel } from "@/app/(main)/_components/article-read-panel";
import { useCommonClasses, useFlexClasses, useTextClasses } from "@/theme/commonStyles";

import { usePageLayoutClasses } from "@/styles/usePageLayouClasses";
import { useAppStore } from "../../../providers/app-store-provider";
import { ChevronLeft20Regular } from "@fluentui/react-icons";
import { useClasses } from "./home-page-client.styles";
import { MobileBottomBar } from "../mobile-bottom-bar";
import { useLargeThenMobile } from "@utils/use-large-then-mobile";
import { useSearchParamNavigation } from "@utils/use-search-param-navigation";
import { useStateChangeEffect } from "@utils/use-state-change-effect";
import { StreamContentItemWithPageIndex } from "@/features/stream-content/use-stream-contents-query";
import { RefreshButton } from "../refresh-button";
import { ArticleListLayout } from "./article-list-layout";

import { ArticleLayoutMenuButton } from "../article-layout-menu-button";
import { ThemeToggleButton } from "../theme-toggle-button";
import { LayoutToggleButton } from "../layout-toggle-button";
import { UnreadOnlyToggleButton } from "../unread-only-toggle-button";
import dynamic from "next/dynamic";

interface Props {
  streamContentQueryKey?: string[];
}

const FeedSideNavDesktop = dynamic(() => import("@/app/(main)/_components/feed-side-nav"), { ssr: false })

export default function Home({ streamContentQueryKey }: Props) {
  const classes = useClasses();
  const pageLayoutClasses = usePageLayoutClasses();
  const flexClasses = useFlexClasses();
  const textClasses = useTextClasses();
  const commonClasses = useCommonClasses();

  const curArticle = useAppStore(store => store.currentArticle);
  const isArticlePanelOpen = useAppStore(store => store.isArticlePanelOpen)
  const setIsArticlePanelOpen = useAppStore(store => store.setIsArticlePanelOpen);
  const openArticleInReadingPanel = useAppStore(store => store.openArticleInReadingPanel);
  const closeArticlePanel = useAppStore(store => store.closeArticlePanel);

  const layoutTypeSelected = useAppStore((state) => state.layoutType);
  const isLargeThenMobile = useLargeThenMobile()
  const layoutType = isLargeThenMobile ? layoutTypeSelected : "default";
  const navigateWithSearch = useSearchParamNavigation()
  const searchParams = useSearchParams();
  const unreadOnly = searchParams.get("unreadOnly") === 'true'

  const handleCloseArticle = useCallback(() => {
    if (!isArticlePanelOpen) return;
    closeArticlePanel();
    navigateWithSearch('/', { articleId: null });
  }, [navigateWithSearch]);

  useStateChangeEffect(searchParams.get('streamId'), handleCloseArticle)

  useStateChangeEffect(searchParams.get('articleId'), (prevArticleId, currentArticleId) => {
    if (prevArticleId && !currentArticleId) {
      setIsArticlePanelOpen(false);
    }
  })

  const onStreamContentItemClick = useCallback(
    (item: StreamContentItemWithPageIndex, index: number) => {
      navigateWithSearch('/', { articleId: item.id });
      openArticleInReadingPanel(item, index);
    },
    [navigateWithSearch, openArticleInReadingPanel]
  );

  const header = () => {
    const isArticlePanelFloat = layoutType !== "split" && isLargeThenMobile && curArticle;
    return (
      <div className={pageLayoutClasses.header}>
        <div className={mergeClasses(classes.title, flexClasses.flexRow)}>
          {isArticlePanelFloat
            ? <Title3>{curArticle?.title}</Title3>
            : <Title3 onClick={handleCloseArticle} className={textClasses.textLg}>{unreadOnly ? "未读文章" : "全部文章"}</Title3>
          }
          <div className={flexClasses.flexGrow}></div>
          {!isArticlePanelFloat &&
            <div className={mergeClasses(flexClasses.flexDisableShrink, commonClasses.spaceX2)}>
              <ArticleLayoutMenuButton />
              <ThemeToggleButton />
              <LayoutToggleButton />
              <UnreadOnlyToggleButton />
              <RefreshButton />
            </div>
          }
        </div>
      </div>
    )
  }

  return (
    <div className={classes.root}>
      {isLargeThenMobile && <FeedSideNavDesktop />}
      {!isLargeThenMobile && <MobileBottomBar onCloseArticle={handleCloseArticle} />}
      <div className={pageLayoutClasses.main}>
        <div
          className={mergeClasses(
            pageLayoutClasses.content,
            layoutType === "split" && pageLayoutClasses.contentSplitViewMid
          )}
        >
          {isLargeThenMobile && (header())}

          <div className={classes.body}>
            {/* 文章列表 */}
            <ArticleListLayout>
              <StreamContentQueryKeyProvider initValue={streamContentQueryKey}>
                <Suspense fallback={<StreamContentPanelSkeleton />}>
                  <StreamContentPanel
                    curArticleId={curArticle?.id ?? null}
                    onStreamContentItemClick={onStreamContentItemClick}
                  />
                </Suspense>
              </StreamContentQueryKeyProvider>
            </ArticleListLayout>

            {/* 文章面板 */}
            {layoutType !== "split" && (
              <div
                className={mergeClasses(
                  classes.articelPanel,
                  isArticlePanelOpen
                    ? classes.articelPanelOpened
                    : classes.articelPanelClosed
                )}
              >
                {/* 文章面板 header */}
                {isLargeThenMobile &&
                  <div className={classes.articelPanelHeader}>
                    <Button
                      appearance="transparent"
                      icon={<ChevronLeft20Regular />}
                      onClick={handleCloseArticle}
                    />
                  </div>
                }
                <ArticleReadPanel
                  onCloseArticle={handleCloseArticle}
                  curArticle={curArticle}
                />
              </div>
            )}
          </div>
        </div>

        {layoutType === "split" && (
          <div
            className={mergeClasses(
              pageLayoutClasses.content,
              pageLayoutClasses.contentSplitViewEnd
            )}
          >
            <div className={pageLayoutClasses.header}>
              {curArticle ? (
                <Text
                  className={mergeClasses(
                    classes.title,
                    textClasses.textLg,
                    classes.headerTextBlock
                  )}
                  wrap={false}
                  truncate
                >
                  {curArticle.title}
                </Text>
              ) : (
                <Text
                  className={mergeClasses(
                    classes.title,
                    textClasses.textLg,
                    classes.headerTextBlock
                  )}
                  wrap={false}
                >
                  未选择文章
                </Text>
              )}
            </div>
            <div className={classes.body}>
              <div className={mergeClasses(classes.articelPanel)}>
                <ArticleReadPanel
                  onCloseArticle={handleCloseArticle}
                  curArticle={curArticle}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
