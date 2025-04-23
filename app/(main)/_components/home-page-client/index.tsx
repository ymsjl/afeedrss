"use client";

import React, { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
} from "@fluentui/react-components";

import type { LayoutType } from "@/store/app-store";
import { StreamContentQueryKeyProvider } from "@/features/stream-content/stream-content-query-key-context";
import { StreamContentItem } from "@server/inoreader/stream.types";

import { StreamContentPanel } from "@/app/(main)/_components/stream-content-panel";
import { StreamContentPanelSkeleton } from "@/app/(main)/_components/stream-content-panel/stream-content-panel-skeleton";
import { ArticleReadPanel } from "@/app/(main)/_components/article-read-panel";
import { useCommonClasses, useFlexClasses, useTextClasses } from "@/theme/commonStyles";
import { extractFirst } from "@utils/index";
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
import { useLargeThenMobile } from "@/utils/use-large-then-mobile";
import { useClasses } from "./useClasses";

const LayoutColumnTwoSplitLeftIcon = bundleIcon(
  LayoutColumnTwoSplitLeft20Filled,
  LayoutColumnTwoSplitLeft20Regular
);
const LayoutColumnTwoIcon = bundleIcon(
  LayoutColumnTwo20Filled,
  LayoutColumnTwo20Regular
);
const LayoutColumnOneIcon = bundleIcon(
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
  const [curArticle, setCurArticle] = useState<StreamContentItem | null>(null);
  const [isArticlePanelOpen, setIsArticlePanelOpen] = useState(false);
  const layoutType = useAppStore((state) => state.layoutType);
  const isLargeThenMobile = useLargeThenMobile()
  const setLayoutType = useAppStore((state) => state.setLayoutType);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [unreadOnly, setUnreadOnly] = useState(() => {
    return !!extractFirst(searchParams.get("unreadOnly"));
  });

  const handleCloseArticle = useCallback(() => {
    if (!isArticlePanelOpen) return;
    setIsArticlePanelOpen(false);
    setTimeout(() => setCurArticle(null), 500);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete("articleId");
    router.push(`/?${newSearchParams.toString()}`);
  }, [searchParams, router]);

  useStreamIdUpdateEffect(handleCloseArticle);

  const handleArticleIdUpdate: Parameters<typeof useArticleIdUpdateEffect>[0] = useCallback((prev, current) => {
    if (prev && !current) {
      setIsArticlePanelOpen(false);
    }
  }, [handleCloseArticle])

  useArticleIdUpdateEffect(handleArticleIdUpdate)

  const onStreamContentItemClick = useCallback(
    (item: StreamContentItem) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("articleId", item.id);
      router.push(`/?${newSearchParams.toString()}`);
      setCurArticle(item);
      setIsArticlePanelOpen(true);
    },
    [router, searchParams]
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
          <Menu
            positioning={{ align: "end" }}
            checkedValues={{
              layoutType: [layoutType],
              unreadOnly: [String(unreadOnly)],
            }}
            onCheckedValueChange={(_, { name, checkedItems }) => {
              if (name === "layoutType") {
                setLayoutType(checkedItems[0] as LayoutType);
              }
            }}
          >
            <MenuTrigger disableButtonEnhancement>
              <MenuButton icon={<LayoutColumnTwoSplitLeftIcon />}>
                布局
              </MenuButton>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuGroup>
                  <MenuItemRadio
                    icon={<LayoutColumnOneIcon />}
                    name="layoutType"
                    value="default"
                  >
                    默认布局
                  </MenuItemRadio>
                  <MenuItemRadio
                    icon={<LayoutColumnTwoIcon />}
                    name="layoutType"
                    value="split"
                  >
                    分栏布局
                  </MenuItemRadio>
                </MenuGroup>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <FeedSideNav />
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
                <div className={classes.articelPanelHeader}>
                  <Button
                    appearance="transparent"
                    icon={<ChevronLeft20Regular />}
                    onClick={handleCloseArticle}
                  />
                </div>
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
              <Button
                icon={<ChevronLeft20Regular />}
                size="large"
                onClick={handleCloseArticle}
              ></Button>
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

const useStreamIdUpdateEffect = (cb: () => void) => {
  const searchParams = useSearchParams();
  const prevStreamIdRef = React.useRef<string | null>(null);
  const streamId = searchParams.get("streamId");

  useEffect(() => {
    () => {
      prevStreamIdRef.current = streamId;
    };
  }, [streamId]);

  useEffect(() => {
    if (streamId !== prevStreamIdRef.current) {
      prevStreamIdRef.current = streamId;
      cb();
    }
  }, [cb, streamId]);
};

const useArticleIdUpdateEffect = (cb: (prev: string | null, current: string | null) => void) => {
  const searchParams = useSearchParams();
  const prevStreamIdRef = React.useRef<string | null>(null);
  const articleId = searchParams.get("articleId");

  useEffect(() => {
    () => {
      prevStreamIdRef.current = articleId;
    };
  }, [articleId]);

  useEffect(() => {
    if (articleId !== prevStreamIdRef.current) {
      cb(prevStreamIdRef.current, articleId);
      prevStreamIdRef.current = articleId;
    }
  }, [cb, articleId]);
};
