import {
  mergeClasses,
  Divider,
  Caption1,
  Button,
} from "@fluentui/react-components";
import { useCommonClasses, useFlexClasses } from "@/theme/commonStyles";
import dayjs from "@utils/dayjs";
import { useProseClasses } from "./prose.styles";
import StatusCard, { Status } from "@/components/status-card";
import { useLargeThenMobile } from "@/utils/use-large-then-mobile";
import { ChevronLeft20Regular, WindowNew20Regular } from "@fluentui/react-icons";
import React, { useRef, useEffect } from "react";
import { useAppStore } from "@/app/providers/app-store-provider";
import { useArticleReadPanelControl } from "./article-read-panel-control-context";
import { ActionsBarLayout } from '../actions-bar-layout';
import { useClasses } from "./article-read-panel.styles";

interface ArticleReadPanelProps {
  className?: string;
}

export const ArticleReadPanel: React.FC<ArticleReadPanelProps> = React.memo(({ className }) => {
  const classes = useClasses();
  const proseClasses = useProseClasses();
  const flexClasses = useFlexClasses();
  const commonClasses = useCommonClasses();
  const isLargeThenMobile = useLargeThenMobile();
  const articleScrollContainerRef = useRef<HTMLDivElement>(null);
  const curArticle = useAppStore(store => store.currentArticle);
  const { closeArticlePanel } = useArticleReadPanelControl();

  useEffect(() => {
    if (articleScrollContainerRef.current) {
      articleScrollContainerRef.current.scrollTop = 0;
    }
  }, [curArticle?.id]);

  const articleReadPanelToolbar = isLargeThenMobile && (
    <ActionsBarLayout>
      <Button
        icon={<ChevronLeft20Regular />}
        onClick={closeArticlePanel}
      />
      <div className={flexClasses.flexGrow}></div>
      <Button
        icon={<WindowNew20Regular />}
        onClick={() => window.open(curArticle?.canonical[0]?.href)}
        title="在新标签页打开"
      />
    </ActionsBarLayout>
  );

  return (
    <div
      className={mergeClasses(
        flexClasses.headerBodyColumn,
        commonClasses.fullHeightScrollHideScrollbar,
        className
      )}
      ref={articleScrollContainerRef}
    >
      {articleReadPanelToolbar}
      <div className={mergeClasses(classes.articelPanelLayout, classes.articelPanelSurface)}>
        {curArticle
          ? (<>
            <article className={mergeClasses(classes.articleLayout, proseClasses.root)}>
              <h1>{curArticle?.title}</h1>
              <div className={flexClasses.flexCenter}>
                <Caption1 className={classes.caption}>
                  {`${curArticle?.origin.title}/${dayjs(curArticle?.published * 1000).fromNow()}`}
                </Caption1>
              </div>
              <div dangerouslySetInnerHTML={{ __html: curArticle?.summary.content ?? "" }} />
            </article>
            <Divider className={classes.divider}>完</Divider>
          </>)
          : <StatusCard status={Status.EMPTY} content="尚未选择文章" />}
      </div>
    </div>
  );
});

ArticleReadPanel.displayName = "ArticleReadPanel";


