import { useRef, useEffect } from "react";
import {
  Button,
  Text,
  mergeClasses,
  makeStyles,
  tokens,
  Divider,
} from "@fluentui/react-components";
import { WindowNew20Regular } from "@fluentui/react-icons";
import { StreamContentItem } from "@/server/inoreader/stream.types";
import {
  useCommonClasses,
  useFlexClasses,
  useTextClasses,
} from "@/theme/commonStyles";
import dayjs from "@/utils/dayjs";
import StatusCard, { Status } from "@/components/status-card";
import { useProseClasses } from "./proseClasses";

interface ArticleReadPanelProps {
  onCloseArticle: () => void;
  curArticle: StreamContentItem | null;
}

export function ArticleReadPanel(props: ArticleReadPanelProps) {
  const { onCloseArticle, curArticle } = props;
  const articleScrollContainerRef = useRef<HTMLDivElement>(null);
  const classes = useClasses();
  const commonClasses = useCommonClasses();
  const flexClasses = useFlexClasses();
  const textClasses = useTextClasses();
  const proseClasses = useProseClasses();

  useEffect(() => {
    if (articleScrollContainerRef.current) {
      articleScrollContainerRef.current.scrollTop = 0;
    }
  }, [curArticle?.id]);

  return (
    <>
      {/* 文章面板 body */}
      <div className={classes.body}>
        <div
          className={mergeClasses(classes.scroll, commonClasses.noScrollbar)}
          ref={articleScrollContainerRef}
        >
          {curArticle ? (
            <>
              <article
                className={mergeClasses(
                  commonClasses.mxAuto,
                  commonClasses.mt8,
                  proseClasses.root
                )}
              >
                <h1>{curArticle?.title}</h1>
                <div className={flexClasses.flexCenter}>
                  <Text
                    className={mergeClasses(
                      textClasses.textQuaternary,
                      textClasses.textSm,
                      flexClasses.flexGrow
                    )}
                  >{`${curArticle?.origin.title}/${dayjs(
                    curArticle?.published * 1000
                  ).fromNow()}`}</Text>
                  <Button
                    appearance="transparent"
                    icon={<WindowNew20Regular />}
                    onClick={() => window.open(curArticle?.canonical[0].href)}
                    title="在新标签页打开"
                  />
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: curArticle?.summary.content ?? "",
                  }}
                />
              </article>
              <Divider className={classes.divider}>完</Divider>
            </>
          ) : (
            <StatusCard status={Status.EMPTY} content="尚未选择文章" />
          )}
        </div>
      </div>
    </>
  );
}

const useClasses = makeStyles({
  title: {
    display: "block",
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    cursor: "pointer",
  },
  body: {
    position: "relative",
    flex: 1,
  },
  scroll: {
    position: "absolute",
    flex: 1,
    top: 0,
    left: 0,
    overflowY: "scroll",
    width: "100%",
    height: "100%",
    paddingInline: tokens.spacingHorizontalM,
    "@media (min-width: 640px)": {
      paddingInline: tokens.spacingHorizontalL,
    },
  },
  divider: {
    paddingBlockStart: tokens.spacingVerticalXXXL,
    paddingBlockEnd: tokens.spacingVerticalXXXL,
    marginInline: tokens.spacingHorizontalL,
    width: 'auto'
  },
});
