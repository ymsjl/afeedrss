import {
  InfiniteData,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import service from "@server/index";
import { StreamContentItem, StreamContentsResponse } from "@server/inoreader";
import { useCallback, useMemo } from "react";
import produce from "immer";
import { useStreamContentQueryKey } from "./StreamContentQueryKeyContext";

export interface StreamContentItemWithPageIndex extends StreamContentItem {
  pageIndex: number;
}

export const useStreamItemAction = () => {
  const queryClient = useQueryClient();
  const queryKey = useStreamContentQueryKey();

  const markItemAsRead = useCallback(
    async (target: StreamContentItemWithPageIndex) => {
      await service.inoreader.markArticleAsRead(target.id, target.isRead);
      queryClient.setQueryData<InfiniteData<StreamContentsResponse>>(
        queryKey,
        produce<InfiniteData<StreamContentsResponse>>((draft) => {
          const { items } = draft.pages[target.pageIndex];
          const draftTarget = items.find(({ id }) => id === target.id);
          if (draftTarget) {
            draftTarget!.isRead = !target.isRead;
          }
        })
      );
    },
    [queryClient, queryKey]
  );

  const markAboveAsRead = useCallback(
    async (target: StreamContentItemWithPageIndex, isRead: boolean) => {
      const pendingIds: string[] = [];
      queryClient.setQueryData(
        queryKey,
        produce<InfiniteData<StreamContentsResponse>>((draft) => {
          const itemsToUpdate = [];
          for (const pageIndex in draft.pages) {
            if (!Object.prototype.hasOwnProperty.call(draft.pages, pageIndex))
              return;
            const { items } = draft.pages[pageIndex];
            if (Number(pageIndex) < target.pageIndex) {
              itemsToUpdate.push(...items);
            } else if (Number(pageIndex) === target.pageIndex) {
              const targetIndex = items.findIndex(({ id }) => id === target.id);
              itemsToUpdate.push(...items.slice(0, targetIndex));
            }
          }
          itemsToUpdate
            .filter(({ isRead }) => !isRead)
            .forEach((item) => {
              item.isRead = true;
              pendingIds.push(item.id);
            });
        })
      );
      await service.inoreader.markArticleAsRead(pendingIds, !isRead);
    },
    [queryClient, queryKey]
  );

  const markItemAsStar = useCallback(() => { }, []);

  return useMemo(() => {
    return {
      markItemAsRead,
      markAboveAsRead,
      markItemAsStar,
    };
  }, [markAboveAsRead, markItemAsRead, markItemAsStar]);
};
