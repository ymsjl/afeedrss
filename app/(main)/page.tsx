"use client";

import React, { useState, useContext, useCallback } from "react";
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

import { GlobalNavigationCtx } from "@components/HomePageLayout/GlobalNavigationCtx";
import { StreamContentPanel } from "@components/StreamContentPanel";
import { ArticleReadPanel } from "@components/ArticleReadPanel";
import { Hamburger } from "@fluentui/react-nav-preview";
import {
  useCommonClasses,
  useFlexClasses,
  useTextClasses,
} from "@/theme/commonStyles";
import { extractFirst } from "@utils/index";

interface Props {}

export default function Home({}: Props) {
  const classes = useClasses();
  const commonClasses = useCommonClasses();
  const flexClasses = useFlexClasses();
  const textClasses = useTextClasses();

  const { setIsOpen, isOpen } = useContext(GlobalNavigationCtx);
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
      router.push(`/?articleId=${item.id}`);
      setCurArticle(item);
      setIsArticlePanelOpen(true);
    },
    [router]
  );

  return (
    <>
      <div className={classes.header}>
        <Hamburger
          onClick={() => setIsOpen(!isOpen)}
          className={mergeClasses(
            classes.hamburger,
            isOpen && classes.hamburgerHiden
          )}
        />
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
    </>
  );
}

const useClasses = makeStyles({
  body: {
    position: "relative",
    overflow: "hidden",
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    background: "inherit",
    ...shorthands.padding(0, 0, tokens.spacingVerticalL),
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
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
    ...shorthands.borderRadius(
      tokens.borderRadiusMedium,
      tokens.borderRadiusMedium,
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
