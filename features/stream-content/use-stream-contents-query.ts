import { useStreamContentQueryKey } from "@/features/stream-content/stream-content-query-key-context";
import { makeStreamContentQueryOptions } from "@services/inoreader/stream.rquery";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { StreamContentItem, SystemStreamIDs } from "@services/inoreader/stream.types";

export interface StreamContentItemWithPageIndex extends StreamContentItem {
  pageIndex: number;
}

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
