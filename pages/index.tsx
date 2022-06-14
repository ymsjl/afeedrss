import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import {
  IconButton,
  Spinner,
  Stack,
  StackItem,
  List,
  Image,
  ImageFit,
  Text,
  DefaultButton,
  IList,
} from "@fluentui/react";
import { Waypoint } from "react-waypoint";
import { produce } from "immer";

import {
  useStreamContent,
  fetchStreamContent,
} from "../utils/useStreamContent";
import { filterImgSrcfromHtmlStr } from "../utils/filterImgSrcfromHtmlStr";
import {
  StreamContentItem,
  StreamContentItemWithPageIndex,
  StreamContentsResponse,
  SystemStreamIDs,
} from "../server/inoreader";

import StatusCard, { Status } from "../components/statusCard";
import SourcesPanel from "../components/sourcePanel";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { getRootStreamId } from "../utils/getRootSteamId";
import server from "../server";
import {
  InfiniteData,
  useQueryClient,
  QueryClient,
  dehydrate,
} from "react-query";
import { getStreamContentQueryKey } from "../utils/getStreamContentQueryKey";
import { LAYOUT } from "../constants";

interface Props {}

const getQueryParma = (query: string | string[] | undefined) => {
  if (Array.isArray(query)) {
    return query[0];
  } else {
    return query;
  }
};

export default function Home({}: Props) {
  const [curArticle, setCurArticle] = useState<StreamContentItem | null>(null);
  const [isArticlePanelOpen, setIsArticlePanelOpen] = useState(false);
  const [isAritleTitleShow, setIsAritleTitleShow] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const router = useRouter();
  const [unreadOnly, setUnreadOnly] = useState(() => {
    return !!getQueryParma(router.query.unreadOnly);
  });
  const streamId =
    getQueryParma(router.query.streamId) ?? getRootStreamId(userId);

  const streamContentQueryKey = getStreamContentQueryKey({
    unreadOnly,
    userId,
    streamId,
  });
  const streamContentQuery = useStreamContent(streamContentQueryKey);
  const articleScrollContainerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<IList>(null);
  const queryClient = useQueryClient();

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

  useEffect(() => {
    if (articleScrollContainerRef.current) {
      articleScrollContainerRef.current.scrollTop = 0;
    }
  }, [curArticle?.id]);

  const onEnterWaypoint = useCallback(() => {
    if (streamContentQuery.hasNextPage) {
      streamContentQuery.fetchNextPage();
    }
  }, [streamContentQuery]);

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

  const onRenderCell = useCallback(
    (
      item?: StreamContentItemWithPageIndex,
      index?: number
    ): React.ReactNode => {
      if (!item) return null;
      const { title } = item;

      const isSelected = curArticle?.id === item.id;
      const onRead: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        markAsRead(item);
      };

      const onClickTitle = () => {
        setCurArticle(item);
        setIsArticlePanelOpen(true);
        if (!item.isRead) {
          markAsRead(item);
        }
      };

      return (
        <>
          <div
            data-is-focusable={true}
            className={`flex space-x-4 mb-3 p-3 rounded-lg cursor-pointer break-all hover:bg-blue-100 transition ${
              !isSelected && item?.isRead ? "opacity-30" : ""
            } ${isSelected ? "ring-1 ring-inset bg-white" : ""}`}
            onClick={onClickTitle}
          >
            <div className="shrink-0">
              <Image
                src={filterImgSrcfromHtmlStr(item.summary.content)}
                width={80}
                height={80}
                imageFit={ImageFit.cover}
                className="bg-gray-300 rounded-md"
                alt=""
              />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex-1">
                <Text className="cursor-pointer" block>
                  {title}
                </Text>
              </div>
              <div className="flex items-center">
                <Text className="text-xs text-gray-400 flex-1">
                  {item.origin.title}
                </Text>
                <div className=" shrink-0">
                  <IconButton
                    iconProps={{
                      iconName: item.isRead ? "CompletedSolid" : "Completed",
                    }}
                    onClick={onRead}
                  />
                </div>
              </div>
            </div>
          </div>
          {index === streamContentListItems.length - 1 ? (
            <Waypoint onEnter={onEnterWaypoint} />
          ) : null}
        </>
      );
    },
    [curArticle?.id, markAsRead, onEnterWaypoint, streamContentListItems.length]
  );

  const onRenderList = () => {
    if (streamContentQuery.isFetched) {
      if (streamContentQuery.error) {
        return <StatusCard status={Status.ERROR} content="出错了" />;
      } else if (streamContentListItems.length === 0) {
        return <StatusCard status={Status.EMPTY} content="这里是空的" />;
      }
    }

    return (
      <List
        items={streamContentListItems}
        onRenderCell={onRenderCell}
        onShouldVirtualize={() => false}
        componentRef={listRef}
        version={[onRenderCell]}
      />
    );
  };

  const onClickRefresh = () => {
    listRef.current?.scrollToIndex(0);
    queryClient.refetchQueries(streamContentQueryKey);
  };

  const onClickFilter = () => {
    setUnreadOnly((state) => !state);
  };

  const leftSideElem = (
    <Stack
      grow
      tokens={{ maxWidth: LAYOUT.NAVIGATION_WIDTH }}
      className="hidden sm:flex"
    >
      <Stack
        disableShrink
        className="px-4 py-4"
        horizontal
        verticalAlign="center"
        horizontalAlign="space-between"
      >
        <StackItem disableShrink>
          <Image
            src=""
            alt=""
            className="w-12 h-12 rounded-full bg-gray-400 mr-4"
          />
        </StackItem>
        <StackItem grow disableShrink>
          <Text className="text-lg font-bold" block>
            {session?.user?.name}
          </Text>
          <Text className="text-base text-gray-400">
            {session?.user?.email}
          </Text>
        </StackItem>
        <StackItem disableShrink>
          <Link href="/settings" passHref>
            <a>
              <IconButton iconProps={{ iconName: "Settings" }} />
            </a>
          </Link>
        </StackItem>
      </Stack>

      <Stack className="sticky top-0 overflow-y-hidden" grow>
        <div className="overflow-y-scroll scrollbar flex-1">
          <SourcesPanel userId={userId} />
        </div>
      </Stack>
    </Stack>
  );

  const midElem = (
    <Stack className="overflow-y-scroll scrollbar bg-gray-50">
      {/* head */}
      <Stack
        className="sticky -top-12 bg-inherit z-10 pt-16 pb-4 px-12"
        horizontal
        verticalAlign="center"
        horizontalAlign="space-between"
      >
        <Text className="text-lg font-bold mr-auto">
          {unreadOnly ? "未读文章" : "全部文章"}
        </Text>
        <DefaultButton
          toggle
          checked={unreadOnly}
          text={unreadOnly ? "全部" : "仅未读"}
          iconProps={{ iconName: unreadOnly ? "FilterSolid" : "Filter" }}
          onClick={onClickFilter}
          className="ml-auto mr-2"
        />
        <DefaultButton
          iconProps={{ iconName: "Refresh" }}
          onClick={onClickRefresh}
          className=""
          text="刷新"
        />
      </Stack>

      <div className="px-10" data-is-scrollable="true">
        {onRenderList()}
        <div className="flex justify-center w-full p-4">
          {streamContentQuery.isFetching && <Spinner />}
        </div>
      </div>
    </Stack>
  );

  const handleCloseArticle = () => {
    setIsArticlePanelOpen(false);
  };

  const articlePaneElem = (
    <Stack
      className="absolute top-0 left-0 right-0 h-full z-10 bg-gray-50 transition-transform"
      style={{
        transform: isArticlePanelOpen ? "translateX(0)" : "translateX(100%)",
      }}
    >
      <Stack
        className="px-12 py-4"
        horizontal
        verticalAlign="center"
        tokens={{ childrenGap: 12 }}
      >
        <StackItem className="overflow-hidden" grow>
          {isAritleTitleShow && (
            <Text
              className="text-lg font-bold block truncate cursor-pointer"
              onClick={() =>
                articleScrollContainerRef.current?.scrollTo({ top: 0 })
              }
            >
              {curArticle?.title}
            </Text>
          )}
        </StackItem>
        <StackItem className="ml-3 mr-0" disableShrink>
          <IconButton
            iconProps={{ iconName: "Cancel" }}
            onClick={handleCloseArticle}
          />
        </StackItem>
      </Stack>

      <Stack className="relative" disableShrink grow>
        <div
          className="overflow-y-scroll scrollbar w-full h-full absolute top-0 left-0 px-12 "
          ref={articleScrollContainerRef}
        >
          {curArticle ? (
            <article className="prose mx-auto mt-24">
              <h1>{curArticle?.title}</h1>
              <Waypoint
                key={curArticle?.title}
                onEnter={() => setIsAritleTitleShow(false)}
                onLeave={() => setIsAritleTitleShow(true)}
              />
              <Stack horizontal verticalAlign="center">
                <StackItem grow>
                  <Text className="text-gray-400 text-sm">{`${curArticle?.origin.title}/${curArticle?.published}`}</Text>
                </StackItem>
                <StackItem>
                  <IconButton
                    iconProps={{ iconName: "OpenInNewWindow" }}
                    onClick={() => window.open(curArticle?.canonical[0].href)}
                    title="在新标签页打开"
                  />
                </StackItem>
              </Stack>
              <div
                dangerouslySetInnerHTML={{
                  __html: curArticle?.summary.content ?? "",
                }}
              />
            </article>
          ) : null}
          <hr className="mt-12 mb-16" />
        </div>
      </Stack>
    </Stack>
  );

  return (
    <>
      <Head>
        <title>RSS 阅读器</title>
      </Head>
      <Stack
        horizontal
        className="relative h-screen overflow-hidden bg-gray-100"
      >
        {leftSideElem}
        <Stack className="bg-gray-200" grow horizontalAlign="center">
          <Stack className="w-full max-w-3xl bg-gray-50 relative h-full overflow-x-hidden">
            {midElem}
            {articlePaneElem}
          </Stack>
        </Stack>
      </Stack>
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
  const userId = session.user?.id;
  if (!userId) {
    return {
      redirect: {
        destination: "/auth/signin",
      },
      props: {},
    };
  }
  const streamId =
    getQueryParma(context.query.streamId) ?? getRootStreamId(userId);
  const queryClient = new QueryClient();
  const unreadOnly = !!getQueryParma(context.query.unreadOnly);
  const streamContentQueryKey = getStreamContentQueryKey({
    unreadOnly,
    userId,
    streamId,
  });
  console.log("session", session.accessToken);
  await queryClient.prefetchQuery(
    streamContentQueryKey,
    async ({ queryKey, pageParam = "" }) => {
      const exclude = !!unreadOnly ? SystemStreamIDs.READ : "";
      const res = await server.inoreader.getStreamContents(String(streamId), {
        exclude: exclude,
        continuation: pageParam,
      }, session.accessToken);
      return res.data;
    }
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
