"use client";
import React from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import {
  mergeClasses,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
} from "@fluentui/react-components";

import { useLargeThenMobile } from "@utils/use-large-then-mobile";
import { useAppStore } from "@/app/providers/app-store-provider";
import { useCommonClasses, useFlexClasses } from "@/theme/commonStyles";
import { useSharedPageLayoutClasses } from "@/styles/shared-page-layout.styles";
import { useClasses } from "./page-client.styles";

import { MobileBottomBar } from "../mobile-bottom-bar";
import { ArticleListPanel } from "../article-list-panel";
import { ArticleReadPanelControlProvider, useArticleReadPanelControl } from "../article-read-panel/article-read-panel-control-context";
import { ArticleReadPanel } from "@/app/(main)/_components/article-read-panel";
import { ZStackLayout, ZStackLayoutProps } from "@components/z-stack-layout";

interface Props {
  streamContentQueryKey?: string[];
}

const FeedSideNavPanel = dynamic(() => import("@/app/(main)/_components/feed-side-nav-panel"), { ssr: false })

export default function Home({ streamContentQueryKey }: Props) {
  const classes = useClasses();
  const commonClasses = useCommonClasses();
  const flexClasses = useFlexClasses();
  const sharedPageLayoutClasses = useSharedPageLayoutClasses();

  const homePageLayoutTypeSelected = useAppStore((state) => state.homePageLayoutType);
  const isLargeThenMobile = useLargeThenMobile()
  const homePageLayoutType = isLargeThenMobile ? homePageLayoutTypeSelected : "default";

  return (
    <ArticleReadPanelControlProvider>
      {!isLargeThenMobile && <MobileBottomBar />}
      <div className={mergeClasses(classes.root, flexClasses.headerBodyRow, commonClasses.fullHeightNoScroll)}>
        {isLargeThenMobile && <FeedSideNavPanel />}
        <div className={mergeClasses(flexClasses.headerBodyColumn, commonClasses.fullHeightNoScroll)}>
          {isLargeThenMobile && <PageHeader className={mergeClasses(sharedPageLayoutClasses.pageTitle, homePageLayoutType === 'default' && sharedPageLayoutClasses.pageTitleCenter)} />}
          <div className={mergeClasses(flexClasses.headerBodyRow, sharedPageLayoutClasses.mainLayout, sharedPageLayoutClasses.mainSurface)} aria-label="main">
            <ArticlePanelZStackLayout
              className={mergeClasses(
                homePageLayoutType === "split" ? classes.columnNoShrink : sharedPageLayoutClasses.content,
                sharedPageLayoutClasses.fullHeightColumnLayout,
              )}
            >
              {({ firstChildClassName, secondChildClassName }) => (
                <>
                  <ArticleListPanel
                    streamContentQueryKey={streamContentQueryKey}
                    className={homePageLayoutType === "default" ? firstChildClassName : ''}
                  />
                  {homePageLayoutType === "default" && <ArticleReadPanel className={secondChildClassName} />}
                </>
              )}
            </ArticlePanelZStackLayout>

            {homePageLayoutType === "split" && (
              <div className={mergeClasses(sharedPageLayoutClasses.fullHeightColumnLayout, classes.columnGrow)}>
                <ArticleReadPanel />
              </div>
            )}
          </div>
        </div>
      </div>
    </ArticleReadPanelControlProvider>
  );
}

const PageHeader: React.FC<{ className?: string, }> = ({ className }) => {
  const searchParams = useSearchParams();
  const unreadOnly = searchParams.get("unreadOnly") === 'true'
  const curArticle = useAppStore(store => store.currentArticle);
  const { closeArticlePanel } = useArticleReadPanelControl();
  return (
    <Breadcrumb size="large" className={className}>
      <BreadcrumbItem>
        <BreadcrumbButton onClick={closeArticlePanel}>{unreadOnly ? "未读文章" : "全部文章"}</BreadcrumbButton>
      </BreadcrumbItem>
      {
        curArticle &&
        <>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton >{curArticle?.title}</BreadcrumbButton>
          </BreadcrumbItem>
        </>
      }
    </Breadcrumb>
  )
}

const ArticlePanelZStackLayout: React.FC<Omit<ZStackLayoutProps, 'isOpen'>> = ({ children, className }) => {
  const isArticlePanelOpen = useAppStore(store => store.isArticlePanelOpen)
  return <ZStackLayout className={className} isOpen={isArticlePanelOpen}>{children}</ZStackLayout>
}