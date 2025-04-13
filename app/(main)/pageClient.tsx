"use client";

import React, { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  mergeClasses,
  makeStyles,
  tokens,
  shorthands,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
} from "@fluentui/react-components";

import { StreamContentQueryKeyProvider } from "@components/StreamContentPanel/StreamContentQueryKeyContext";
import { StreamContentItem } from "@server/inoreader";

import { StreamContentPanel } from "@components/StreamContentPanel";
import { ArticleReadPanel } from "@components/ArticleReadPanel";
import {
  useCommonClasses,
  useFlexClasses,
  useTextClasses,
} from "@/theme/commonStyles";
import { extractFirst } from "@utils/index";
import { SourceNavPanel } from "@/components/SourceNavPanel";
import { usePageLayoutClasses } from "@/styles/usePageLayouClasses";

interface Props { }

export default function Home({ }: Props) {
  const classes = useClasses();
  const pageLayoutClasses = usePageLayoutClasses();
  const commonClasses = useCommonClasses();
  const flexClasses = useFlexClasses();
  const textClasses = useTextClasses();

  const [curArticle, setCurArticle] = useState<StreamContentItem | null>(null);
  const [isArticlePanelOpen, setIsArticlePanelOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [unreadOnly, setUnreadOnly] = useState(() => {
    return !!extractFirst(searchParams.get("unreadOnly"));
  });

  const handleCloseArticle = () => {
    setIsArticlePanelOpen(false);
    setTimeout(() => setCurArticle(null), 500);
  };

  const onStreamContentItemClick = useCallback(
    (item: StreamContentItem) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('articleId', item.id);
      router.push(`/?${newSearchParams.toString()}`);
      setCurArticle(item);
      setIsArticlePanelOpen(true);},
    [router]
  );

  return (
    <div className={classes.root}>
      <SourceNavPanel />
      <div className={pageLayoutClasses.main}>
        <div className={pageLayoutClasses.content}>
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
                {curArticle ? (
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
            </div>
          </div>

          <div className={classes.body}>
            {/* 文章列表 */}
            <div
              className={mergeClasses(
                classes.streamContentPanel,
                commonClasses.noScrollbar,
                isArticlePanelOpen
                  ? classes.streamContentPanelClosed
                  : classes.streamContentPanelOpened
              )}
            >
              <StreamContentQueryKeyProvider>
                <StreamContentPanel
                  curArticleId={curArticle?.id ?? null}
                  onStreamContentItemClick={onStreamContentItemClick}
                />
              </StreamContentQueryKeyProvider>
            </div>

            {/* 文章面板 */}
            <div
              className={mergeClasses(
                classes.articelPanel,
                isArticlePanelOpen
                  ? classes.articelPanelOpened
                  : classes.articelPanelClosed
              )}
            >
              <ArticleReadPanel
                onCloseArticle={handleCloseArticle}
                curArticle={curArticle}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const useClasses = makeStyles({
  root: {
    display: "flex",
    height: "100%",
    flex: 1,
    gap: tokens.spacingHorizontalM,
  },
  body: {
    position: "relative",
    overflow: "hidden",
  },
  title: {
    flexShrink: 0,
  },
  streamContentPanel: {
    overflowY: "scroll",
    height: "100%",
    transition: "all 0.3s ease-in-out",
  },
  streamContentPanelOpened: {
    transform: "translateX(0)",
    opacity: 1,
  },
  streamContentPanelClosed: {
    transform: "translateX(-100%)",
    opacity: 0,
  },
  articelPanel: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    ...shorthands.inset("0"),
    height: "100%",
    zIndex: tokens.zIndexOverlay,
    marginBlockStart: tokens.spacingHorizontalXS,
    marginInline: tokens.spacingHorizontalXS,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow2,
    ...shorthands.borderRadius(
      tokens.borderRadiusLarge,
      tokens.borderRadiusLarge,
      0,
      0
    ),
    transition: "all 0.3s ease-in-out",
  },
  articelPanelOpened: {
    transform: "translateX(0px)",
  },
  articelPanelClosed: {
    transform: "translateX(calc(100% + 16px))",
  },
  hamburger: {
    display: "block",
    paddingBlock: tokens.spacingVerticalS,
  },
  hamburgerHiden: {
    "@media (min-width: 640px)": {
      display: "none",
    },
  },
});
