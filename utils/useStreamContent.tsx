import { FeedItem } from "../types";
import { useInfiniteQuery } from "react-query";
import server from "../server";
import { StreamContentsResponse, SystemStreamIDs } from "../server/inoreader";
import { Dayjs, default as dayjs } from "dayjs";
import { filterImgSrcfromHtmlStr } from "./filterImgSrcfromHtmlStr";

function resolveResponse(data: StreamContentsResponse): FeedItem[] {
  return data.items.map((item, index) => {
    const publishedTime: Dayjs = dayjs.unix(item.published);
    const thumbnailSrc = filterImgSrcfromHtmlStr(item.summary.content);
    return {
      id: item.id,
      title: item.title,
      summary: "",
      thumbnailSrc: thumbnailSrc,
      content: item.summary.content,
      sourceName: item.origin.title,
      sourceID: item.origin.streamId,
      url: item.canonical[0].href,
      publishedTime: publishedTime,
      isRead: false,
      isStar: false,
      isInnerArticleShow: false,
    };
  });
}

export async function fetchStreamContent({
  queryKey,
  pageParam = "",
}: {
  queryKey: any;
  pageParam?: string;
}) {
  const [, streamId, unreadOnly] = queryKey;
  const exclude = !!unreadOnly ? SystemStreamIDs.READ : "";
  const res = await server.inoreader.getStreamContents(String(streamId), {
    exclude: exclude,
    continuation: pageParam,
  });
  return res.data;
}

export function useStreamContent(streamContentQueryKey: unknown[]) {
  // 从服务器获取 feed 流，并且将响应数据转换成组件的状态，将数据范式化
  const streamContentQuery = useInfiniteQuery(
    streamContentQueryKey,
    fetchStreamContent,
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.continuation;
      },
    }
  );

  return streamContentQuery;
}
