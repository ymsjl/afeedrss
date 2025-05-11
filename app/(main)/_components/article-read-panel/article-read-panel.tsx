import React, { useRef, useEffect, useCallback } from "react";
import {
  mergeClasses,
  Divider,
  Caption1,
  Button,
  createMotionComponent,
  motionTokens,
  MotionImperativeRef,
  createPresenceComponent,
} from "@fluentui/react-components";
import { useCommonClasses, useFlexClasses } from "@/theme/commonStyles";
import dayjs from "@utils/dayjs";
import { StatusCard, Status } from "@/components/status-card";
import { useLargeThenMobile } from "@/utils/use-large-then-mobile";
import { WindowNew20Regular } from "@fluentui/react-icons";
import { useAppStore } from "@/app/providers/app-store-provider";
import { ActionsBarLayout } from '../actions-bar-layout';
import { StarButton } from "../star-button";
import { useClasses } from "./article-read-panel.styles";
import { useProseClasses } from "./prose.styles";
import { CloseArticleReadPanelButton } from "../close-article-read-panel-button";
import { useStateChangeEffect } from "@/utils/use-state-change-effect";

interface ArticleReadPanelProps {
  className?: string;
  showBackButton?: boolean;
  animated?: boolean;
}

const FadeSlideUp = createMotionComponent({
  keyframes: [
    {
      opactity: 0,
      transform: "translateY(15%)",
    },
    {
      opactity: 1,
      transform: "translateY(0)",
    }
  ],
  duration: motionTokens.durationNormal,
  easing: motionTokens.curveDecelerateMin,
  iterations: 1,

  reducedMotion: {
    iterations: 1,
  },
});

export const ArticleReadPanel: React.FC<ArticleReadPanelProps> = React.memo(({ className, showBackButton = true, animated=true }) => {
  const classes = useClasses();
  const proseClasses = useProseClasses();
  const flexClasses = useFlexClasses();
  const commonClasses = useCommonClasses();
  const isLargeThenMobile = useLargeThenMobile();
  const articleScrollContainerRef = useRef<HTMLDivElement>(null);
  const curArticle = useAppStore(store => store.currentArticle);
  const motionRef = React.useRef<MotionImperativeRef>();

  const onArticleIdChange = useCallback((prevArticleId: string | undefined, currentArticleId: string | undefined) => {
    if (!articleScrollContainerRef.current) {
      return null
    }
    if (prevArticleId !== currentArticleId) {
      articleScrollContainerRef.current.scrollTop = 0;
      animated && motionRef.current?.setPlayState("running");
    }
  }, [animated]);

  useStateChangeEffect(curArticle?.id, onArticleIdChange);

  const articleReadPanelToolbar = isLargeThenMobile && (
    <ActionsBarLayout>
      {showBackButton && <CloseArticleReadPanelButton />}
      <StarButton />
      <Button
        icon={<WindowNew20Regular />}
        onClick={() => window.open(curArticle?.canonical[0]?.href)}
        title="在新标签页打开"
      />
      <div className={flexClasses.flexGrow}></div>
    </ActionsBarLayout>
  );

  const articleContent = curArticle && (
    <>
      <article className={mergeClasses(classes.articleLayout, proseClasses.root)}>
        <h1>{curArticle?.title}</h1>
        <div>
          <Caption1 className={classes.caption}>
            {`${curArticle?.origin.title}/${dayjs(curArticle?.published * 1000).fromNow()}`}
          </Caption1>
        </div>
        <div dangerouslySetInnerHTML={{ __html: curArticle?.summary.content ?? "" }} />
      </article>
      <Divider className={classes.divider}>完</Divider>
    </>
  )

  const articleRender = () => {
    if (!curArticle) {
      return (<StatusCard status={Status.EMPTY} content="尚未选择文章" />)
    } else if (!animated) {
      return articleContent
    } else {
      return (
        <FadeSlideUp imperativeRef={motionRef} >
          <div>{articleContent}</div>
        </FadeSlideUp>
      )
    }
  }

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
        {articleRender()}
      </div>
    </div>
  );
});

ArticleReadPanel.displayName = "ArticleReadPanel";


