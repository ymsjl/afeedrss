import { useStreamContentQueryKey } from "@/features/stream-content/stream-content-query-key-context";
import { makeStreamContentQueryOptions } from "@/server/inoreader/stream.rquery";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { StreamContentItemWithPageIndex } from "./use-stream-content-actions";
import { SystemStreamIDs } from "@/server/inoreader/stream.types";

export function useStreamContentsQuery() {
  const queryKey = useStreamContentQueryKey();
  const streamContentQuery = useSuspenseInfiniteQuery(makeStreamContentQueryOptions(queryKey));
  const queryData = streamContentQuery.data;
  const data = useMemo(() => {
    if (!queryData || !queryData.pages) {
      return [];
    }

    return queryData.pages.reduce(
      (acc, cur, pageIndex) =>
        acc.concat(cur.items.map((item) => ({
          ...item,
          pageIndex,
          isStarred: item.categories.includes(SystemStreamIDs.STARRED),
          isRead: item.categories.includes(SystemStreamIDs.READ),
        }))),
      [] as StreamContentItemWithPageIndex[]
    );
  }, [queryData]);

  return { ...streamContentQuery, data }
}