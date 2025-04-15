"use client";

import React, { useState, useCallback, useEffect } from "react";
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
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  MenuGroup,
  MenuDivider,
  MenuGroupHeader,
  MenuItemRadio,
  MenuItemSwitch,
  Text,
} from "@fluentui/react-components";

import type { LayoutType } from "@/store/appStore";
import { StreamContentQueryKeyProvider } from "@components/StreamContentPanel/StreamContentQueryKeyContext";
import { StreamContentItem } from "@server/inoreader/stream.types";

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
import { useAppStore } from "../providers/AppStoreProvider";
import {
  bundleIcon,
  CalendarMonthRegular,
  FilterRegular,
  CutRegular,
  CutFilled,
  ClipboardPasteRegular,
  LayoutColumnTwoSplitLeft20Regular,
  LayoutColumnTwoSplitLeft20Filled,
  LayoutCellFour20Regular,
  LayoutColumnTwo20Regular,
  LayoutColumnTwo20Filled,
  LayoutColumnOneThirdLeft20Regular,
  LayoutColumnOneThirdLeft20Filled,
  ClipboardPasteFilled,
  EditRegular,
  EditFilled,
  ChevronLeft20Regular,
} from "@fluentui/react-icons";

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

interface Props {}

export default function Home({}: Props) {
  const classes = useClasses();
  const pageLayoutClasses = usePageLayoutClasses();
  const commonClasses = useCommonClasses();
  const flexClasses = useFlexClasses();
  const textClasses = useTextClasses();
  const [curArticle, setCurArticle] = useState<StreamContentItem | null>(null);
  const [isArticlePanelOpen, setIsArticlePanelOpen] = useState(false);
  const layoutType = useAppStore((state) => state.layoutType);
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

  return (
    <div className={classes.root}>
      <SourceNavPanel />
      <div className={pageLayoutClasses.main}>
        <div
          className={mergeClasses(
            pageLayoutClasses.content,
            layoutType === "split" && pageLayoutClasses.contentSplitViewMid
          )}
        >
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
                    {/* <MenuGroup>
                      <MenuItemSwitch
                        icon={<LayoutColumnTwoIcon />}
                        name="unreadOnly"
                        value="true"
                      >
                        仅看未读
                      </MenuItemSwitch>
                    </MenuGroup> */}
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

          <div className={classes.body}>
            {/* 文章列表 */}
            <div
              className={mergeClasses(
                classes.streamContentPanel,
                commonClasses.noScrollbar,
                layoutType !== "split" &&
                  (isArticlePanelOpen
                    ? classes.streamContentPanelClosed
                    : classes.streamContentPanelOpened)
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
          <div className={pageLayoutClasses.content}>
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
    height: "100%",
  },
  title: {
    flexGrow: 1,
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
  headerTextBlock: {
    paddingBlock: tokens.spacingVerticalS,
    lineHeight: tokens.lineHeightBase300,
  },
  articelPanelHeader: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    "@media (min-width: 640px)": {
      ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalL),
    },
  },
});

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
