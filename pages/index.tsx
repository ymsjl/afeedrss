import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { useRouter } from "next/router";
import {
  Button,
  Text,
  mergeClasses,
  makeStyles,
  tokens,
  shorthands,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
} from "@fluentui/react-components";
import { produce } from "immer";

import { useStreamContent } from "../utils/useStreamContent";
import { StreamContentItem, StreamContentsResponse } from "../server/inoreader";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { getRootStreamId } from "../utils/getRootSteamId";
import server from "../server";
import { InfiniteData, useQueryClient } from "react-query";
import { getStreamContentQueryKey } from "../utils/getStreamContentQueryKey";
import dayjs from "../utils/dayjs";
import { GlobalSettingsCtx } from "./_app";
import { getLayout } from "../components/home/layout";
import { GlobalNavigationCtx } from "./../components/home/layout";
import { ArticleList } from "../components/home/ArticleList";
import {
  ChevronLeft20Regular,
  WindowNew20Regular,
} from "@fluentui/react-icons";
import { Hamburger } from "@fluentui/react-nav-preview";
import {
  useCommonClasses,
  useFlexClasses,
  useTextClasses,
} from "../theme/commonStyles";

interface Props {}

interface StreamContentItemWithPageIndex extends StreamContentItem {
  pageIndex: number;
}

const getQueryParma = (query: string | string[] | undefined) => {
  if (Array.isArray(query)) {
    return query[0];
  } else {
    return query;
  }
};

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
});

const useArticelPanelClasses = makeStyles({
  root: {
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
  rootOpened: {
    transform: "translateX(0px)",
  },
  rootClosed: {
    transform: "translateX(calc(100% + 16px))",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    "@media (min-width: 640px)": {
      ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalL),
    },
  },
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
    marginTop: tokens.spacingVerticalL,
    marginBottom: tokens.spacingVerticalXL,
  },
});

const useArticelListClasses = makeStyles({
  root: {
    overflowY: "scroll",
    height: "100%",
    transition: "all 0.3s ease-in-out",

    // backgroundColor: tokens.colorNeutralBackground1,
  },
  rootOpened: {
    transform: "translateX(-100%)",
    opacity: 0,
  },
  rootClosed: {
    transform: "translateX(0)",
    opacity: 1,
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    backgroundColor: tokens.colorNeutralBackground1,
    display: "flex",
    flexDirection: "column",
    background: "inherit",
    ...shorthands.padding(
      "5px",
      tokens.spacingHorizontalL,
      tokens.spacingVerticalM
    ),
    "@media (min-width: 640px)": {
      ...shorthands.paddingInline(tokens.spacingHorizontalXXXL),
    },
  },
  hamburger: {
    display: 'block',
    paddingBlock: tokens.spacingVerticalS,
  },
  HamburgerHiden: {
    "@media (min-width: 640px)": {
      display: "none",
    },
  },
});

function Home({}: Props) {
  const classes = useClasses();
  const articelPanelClasses = useArticelPanelClasses();
  const articelListClasses = useArticelListClasses();
  const flexClasses = useFlexClasses();
  const commonClasses = useCommonClasses();
  const textClasses = useTextClasses();
  const {
    globalSettings: { showFeedThumbnail },
  } = useContext(GlobalSettingsCtx);
  const { setIsOpen, isOpen } = useContext(GlobalNavigationCtx);
  const [curArticle, setCurArticle] = useState<StreamContentItem | null>(null);
  const [isArticlePanelOpen, setIsArticlePanelOpen] = useState(false);
  const [isAritleTitleShow, setIsAritleTitleShow] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const router = useRouter();
  const [unreadOnly, setUnreadOnly] = useState(() => {
    return !!getQueryParma(router.query.unreadOnly);
  });
  const queryClient = useQueryClient();

  const streamId =
    getQueryParma(router.query.streamId) ?? getRootStreamId(userId);
  const articleId = router?.query?.articleId;
  const streamContentQueryKey = getStreamContentQueryKey({
    unreadOnly,
    userId,
    streamId,
  });
  const streamContentQuery = useStreamContent(streamContentQueryKey);

  const streamContentListItems = useMemo(() => {
    const initList: StreamContentItemWithPageIndex[] = [];
    if (!streamContentQuery.data || !streamContentQuery.data.pages) {
      return initList;
    }
    const { pages } = streamContentQuery.data;
    const items = pages.reduce(
      (acc, cur, idx) =>
        acc.concat(cur.items.map((item) => ({ ...item, pageIndex: idx }))),
      initList
    );
    return items;
  }, [streamContentQuery.data]);

  const articleScrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (articleScrollContainerRef.current) {
      articleScrollContainerRef.current.scrollTop = 0;
    }
  }, [curArticle?.id]);

  // useEffect(() => {
  //   if (articleId) {
  //   } else {
  //     setIsArticlePanelOpen(false);
  //   }
  // }, [articleId]);

  const markAsRead = useCallback(
    async (target: StreamContentItemWithPageIndex) => {
      try {
        queryClient.setQueryData(
          streamContentQueryKey,
          produce<InfiniteData<StreamContentsResponse>>((draft) => {
            const { items } = draft.pages[target.pageIndex];
            const draftTarget = items.find(({ id }) => id === target.id);
            if (draftTarget) {
              draftTarget!.isRead = !target.isRead;
            }
          })
        );
        await server.inoreader.markArticleAsRead(target.id, target.isRead);
      } catch (error) {}
    },
    [queryClient, streamContentQueryKey]
  );

  const markAboveAsRead = useCallback(
    async (target: StreamContentItemWithPageIndex, isRead: boolean) => {
      try {
        const pendingIds: string[] = [];
        queryClient.setQueryData(
          streamContentQueryKey,
          produce<InfiniteData<StreamContentsResponse>>((draft) => {
            for (const key in draft.pages) {
              if (Object.prototype.hasOwnProperty.call(draft.pages, key)) {
                const { items } = draft.pages[key];
                if (Number(key) < target.pageIndex) {
                  items.forEach((item) => {
                    if (!item.isRead !== isRead) {
                      item.isRead = isRead;
                      pendingIds.push(item.id);
                    }
                  });
                } else if (Number(key) === target.pageIndex) {
                  let hasFind = false;
                  items.forEach((item) => {
                    if (!hasFind) {
                      if (item.isRead !== isRead) {
                        item.isRead = isRead;
                        pendingIds.push(item.id);
                      }
                      if (item.id === target.id) {
                        hasFind = true;
                      }
                    }
                  });
                }
              }
            }
          })
        );
        await server.inoreader.markArticleAsRead(pendingIds, !isRead);
      } catch (error) {}
    },
    [queryClient, streamContentQueryKey]
  );

  const onSelectArticle = useCallback((article: StreamContentItem) => {
    setCurArticle(article);
    setIsArticlePanelOpen(true);
  }, []);

  const handleCloseArticle = () => {
    // router.back();
    setIsArticlePanelOpen(false);
    setTimeout(() => setCurArticle(null), 500);
  };

  return (
    <>
      <div className={classes.header}>
        <Hamburger
          onClick={() => setIsOpen(!isOpen)}
          className={mergeClasses(
            articelListClasses.hamburger,
            isOpen && articelListClasses.HamburgerHiden
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
            articelListClasses.root,
            commonClasses.noScrollbar,
            isArticlePanelOpen
              ? articelListClasses.rootOpened
              : articelListClasses.rootClosed
          )}
        >
          {/* 列表 body */}
          <div data-is-scrollable="true">
            <ArticleList
              items={streamContentListItems}
              isFetched={streamContentQuery.isFetched}
              error={streamContentQuery.error}
              isFetching={streamContentQuery.isFetching}
              showFeedThumbnail={showFeedThumbnail}
              curArticle={curArticle}
              onMarkAsRead={markAsRead}
              onMarkAboveAsRead={markAboveAsRead}
              onSelectArticle={onSelectArticle}
            />
          </div>
        </div>

        {/* 文章面板 */}
        <div
          className={mergeClasses(
            articelPanelClasses.root,
            isArticlePanelOpen
              ? articelPanelClasses.rootOpened
              : articelPanelClasses.rootClosed
          )}
        >
          {/* 文章面板 header */}
          <div className={articelPanelClasses.header}>
            <div className="overflow-hidden">
              {isAritleTitleShow && (
                <Text
                  className={articelPanelClasses.title}
                  onClick={() =>
                    articleScrollContainerRef.current?.scrollTo({ top: 0 })
                  }
                  wrap={false}
                  block
                  truncate
                >
                  {curArticle?.title}
                </Text>
              )}
            </div>
            <div>
              <Button
                appearance="transparent"
                icon={<ChevronLeft20Regular />}
                onClick={handleCloseArticle}
              />
            </div>
          </div>

          {/* 文章面板 body */}
          <div className={articelPanelClasses.body}>
            <div
              className={mergeClasses(
                articelPanelClasses.scroll,
                commonClasses.noScrollbar
              )}
              ref={articleScrollContainerRef}
            >
              {curArticle ? (
                <article className="prose mx-auto mt-24">
                  <h1>{curArticle?.title}</h1>
                  <div className={flexClasses.flexCenter}>
                    <div className={flexClasses.flexGrow}>
                      <Text className="text-gray-400 text-sm">{`${
                        curArticle?.origin.title
                      }/${dayjs(
                        curArticle?.published * 1000
                      ).fromNow()}`}</Text>
                    </div>
                    <div>
                      <Button
                        icon={<WindowNew20Regular />}
                        onClick={() =>
                          window.open(curArticle?.canonical[0].href)
                        }
                        title="在新标签页打开"
                      />
                    </div>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: curArticle?.summary.content ?? "",
                    }}
                  />
                </article>
              ) : null}
              <hr className={articelPanelClasses.divider} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  any,
  {
    unreadOnly: string;
    userId: string;
    streamId: string;
  }
> = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};

Home.getLayout = getLayout;

export default Home;
