"use client";

import React, { useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  mergeClasses,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuPopover,
  MenuTrigger,
  MenuGroup,
  MenuItemRadio,
  Text,
  ToggleButton,
} from "@fluentui/react-components";

import type { LayoutType } from "@/store/app-store";
import { StreamContentQueryKeyProvider } from "@/features/stream-content/stream-content-query-key-context";

import { StreamContentPanel } from "@/app/(main)/_components/stream-content-panel";
import { StreamContentPanelSkeleton } from "@/app/(main)/_components/stream-content-panel/stream-content-panel-skeleton";
import { ArticleReadPanel } from "@/app/(main)/_components/article-read-panel";
import { useCommonClasses, useFlexClasses, useTextClasses } from "@/theme/commonStyles";
import { FeedSideNav } from "@/app/(main)/_components/feed-side-nav";
import { usePageLayoutClasses } from "@/styles/usePageLayouClasses";
import { useAppStore } from "../../../providers/app-store-provider";
import {
  bundleIcon,
  LayoutColumnTwoSplitLeft20Regular,
  LayoutColumnTwoSplitLeft20Filled,
  LayoutColumnTwo20Regular,
  LayoutColumnTwo20Filled,
  LayoutColumnOneThirdLeft20Regular,
  LayoutColumnOneThirdLeft20Filled,
  ChevronLeft20Regular,
} from "@fluentui/react-icons";
import { useClasses } from "./useClasses";
import { MobileBottomBar } from "../mobile-bottom-bar";
import { useLargeThenMobile } from "@utils/use-large-then-mobile";
import { useSearchParamNavigation } from "@utils/use-search-param-navigation";
import { useStateChangeEffect } from "@utils/use-state-change-effect";
import { StreamContentItemWithPageIndex } from "@/features/stream-content/use-stream-contents-query";

const LayoutIcon = bundleIcon(
  LayoutColumnOneThirdLeft20Filled,
  LayoutColumnOneThirdLeft20Regular
);

interface Props {
  streamContentQueryKey?: string[];
}

export default function Home({ streamContentQueryKey }: Props) {
  const classes = useClasses();
  const pageLayoutClasses = usePageLayoutClasses();
  const commonClasses = useCommonClasses();
  const flexClasses = useFlexClasses();
  const textClasses = useTextClasses();

  const curArticle = useAppStore(store => store.currentArticle);
  const isArticlePanelOpen = useAppStore(store => store.isArticlePanelOpen)
  const setIsArticlePanelOpen = useAppStore(store => store.setIsArticlePanelOpen);
  const openArticleInReadingPanel = useAppStore(store => store.openArticleInReadingPanel);
  const closeArticlePanel = useAppStore(store => store.closeArticlePanel);

  const layoutTypeSelected = useAppStore((state) => state.layoutType);
  const toggleLayoutType = useAppStore((state) => state.toggleLayoutType);
  const isLargeThenMobile = useLargeThenMobile()
  const layoutType = isLargeThenMobile ? layoutTypeSelected : "default";
  const navigateWithSearch = useSearchParamNavigation()
  const searchParams = useSearchParams();
  const unreadOnly = searchParams.get("unreadOnly") === 'true'

  const handleCloseArticle = useCallback(() => {
    if (!isArticlePanelOpen) return;
    closeArticlePanel();
    navigateWithSearch('/', { streamId: null, articleId: null });
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
    return (
      <div className={pageLayoutClasses.header}>
        <div className={mergeClasses(classes.title, flexClasses.flexRow)}>
          <Breadcrumb size="large">
            <BreadcrumbItem>
              <BreadcrumbButton
                onClick={handleCloseArticle}
                className={textClasses.textLg}
              >
                {unreadOnly ? "未读文章" : "全部文章"}
              </BreadcrumbButton>
            </BreadcrumbItem>
            {layoutType !== "split" && curArticle ? (
              <>
                <BreadcrumbDivider />
                <BreadcrumbItem>
                  <BreadcrumbButton className={textClasses.textLg}>
                    {curArticle?.title}
                  </BreadcrumbButton>
                </BreadcrumbItem>
              </>
            ) : null}
          </Breadcrumb>

          <div className={flexClasses.flexGrow}></div>
        </div>
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <FeedSideNav />
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
            <div
              tabIndex={-1}
              className={mergeClasses(
                classes.streamContentPanel,
                commonClasses.noScrollbar,
                layoutType !== "split" &&
                (isArticlePanelOpen
                  ? classes.streamContentPanelClosed
                  : classes.streamContentPanelOpened)
              )}
            >
              <StreamContentQueryKeyProvider initValue={streamContentQueryKey}>
                <Suspense fallback={<StreamContentPanelSkeleton />}>
                  <StreamContentPanel
                    curArticleId={curArticle?.id ?? null}
                    onStreamContentItemClick={onStreamContentItemClick}
                  />
                </Suspense>
              </StreamContentQueryKeyProvider>
            </div>

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
