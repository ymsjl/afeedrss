"use client";
import React from "react";
import dynamic from "next/dynamic";
import { mergeClasses } from "@fluentui/react-components";

import { useLargeThenMobile } from "@utils/use-large-then-mobile";
import { useAppStore } from "@/app/providers/app-store-provider";
import { useCommonClasses, useFlexClasses } from "@/theme/commonStyles";
import { useSharedPageLayoutClasses } from "@/styles/shared-page-layout.styles";
import { useClasses } from "./page-client.styles";

import { MobileBottomBar } from "../mobile-bottom-bar";
import { ArticleListPanel } from "../article-list-panel";
import { ArticleReadPanelControlProvider, ArticleReadPanel } from "@/app/(main)/_components/article-read-panel";
import { ZStackLayout, ZStackLayoutProps } from "@components/z-stack-layout";
import { useHomePageLayoutType } from "./use-home-page-layout-type";

interface Props {
  streamContentQueryKey?: string[];
}

const FeedSideNavPanel = dynamic(() => import("@/app/(main)/_components/feed-side-nav-panel"), { ssr: false })

export function HomePageClient({ streamContentQueryKey }: Props) {
  const classes = useClasses();
  const commonClasses = useCommonClasses();
  const flexClasses = useFlexClasses();
  const sharedPageLayoutClasses = useSharedPageLayoutClasses();

  const isLargeThenMobile = useLargeThenMobile()
  const homePageLayoutType = useHomePageLayoutType();
  const streamItemDisplayType = useAppStore(state => state.streamItemDisplayType);

  return (
    <ArticleReadPanelControlProvider>
      {!isLargeThenMobile && <MobileBottomBar />}
      <div className={mergeClasses(classes.root, flexClasses.headerBodyRow, commonClasses.fullHeightNoScroll)}>
        {isLargeThenMobile && <FeedSideNavPanel />}
        <div className={mergeClasses(flexClasses.headerBodyColumn, commonClasses.fullHeightNoScroll)}>
          <div className={mergeClasses(flexClasses.headerBodyRow, sharedPageLayoutClasses.mainLayout, sharedPageLayoutClasses.mainSurface)} aria-label="main">
            <ArticlePanelZStackLayout
              className={mergeClasses(
                homePageLayoutType === "split" ? classes.columnNoShrink : sharedPageLayoutClasses.content,
                streamItemDisplayType === "grid" ? sharedPageLayoutClasses.maxWidthUnset : '',
                sharedPageLayoutClasses.fullHeightColumnLayout,
              )}
            >
              {({ firstChildClassName, secondChildClassName }) => (
                <>
                  <ArticleListPanel
                    streamContentQueryKey={streamContentQueryKey}
                    className={homePageLayoutType === "default" ? firstChildClassName : ''}
                  />
                  {homePageLayoutType === "default" && <ArticleReadPanel className={secondChildClassName} animated={false} />}
                </>
              )}
            </ArticlePanelZStackLayout>

            {homePageLayoutType === "split" && (
              <div className={mergeClasses(sharedPageLayoutClasses.fullHeightColumnLayout, classes.columnGrow)}>
                <ArticleReadPanel showBackButton={false} />
              </div>
            )}
          </div>
        </div>
      </div>
    </ArticleReadPanelControlProvider>
  );
}

const ArticlePanelZStackLayout: React.FC<Omit<ZStackLayoutProps, 'isOpen'>> = ({ children, className }) => {
  const isArticlePanelOpen = useAppStore(store => store.isArticlePanelOpen)
  return <ZStackLayout className={className} isOpen={isArticlePanelOpen}>{children}</ZStackLayout>
}