import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import services from "@services/index";
import { StreamContentsResponse, SystemStreamIDs } from "@services/inoreader/stream.types";
import { useCallback, useMemo } from "react";
import produce from "immer";
import { useStreamContentQueryKey } from "./stream-content-query-key-context";
import { StreamContentItemWithPageIndex } from "./use-stream-contents-query";

export const useStreamContentActions = () => {
  const queryClient = useQueryClient();
  const queryKey = useStreamContentQueryKey();

  const markItemAsRead = useCallback(
    async (target: StreamContentItemWithPageIndex) => {
      // 乐观更新：先本地更新
      const previousData = queryClient.getQueryData<InfiniteData<StreamContentsResponse>>(queryKey);
      queryClient.setQueryData<InfiniteData<StreamContentsResponse>>(
        queryKey,
        produce<InfiniteData<StreamContentsResponse>>((draft) => {
          const { items } = draft.pages[target.pageIndex];
          const draftTarget = items.find(({ id }) => id === target.id);
          if (draftTarget) {
            const starredTagIndex = draftTarget.categories.indexOf(SystemStreamIDs.READ);
            if (starredTagIndex > -1) {
              draftTarget.categories.splice(starredTagIndex, 1);
            } else {
              draftTarget.categories.push(SystemStreamIDs.READ);
            }
          }
        })
      );
      try {
        await services.inoreader.markArticleAsRead(target.id, target.isRead);
      } catch (e) {
        // 回滚
        queryClient.setQueryData(queryKey, previousData);
        throw e;
      }
    },
    [queryClient, queryKey]
  );

  const markAboveAsRead = useCallback(
    async (target: StreamContentItemWithPageIndex, isRead: boolean) => {
      const pendingIds: string[] = [];
      // 乐观更新：先保存旧数据
      const previousData = queryClient.getQueryData<InfiniteData<StreamContentsResponse>>(queryKey);
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
              if (item) {
                const starredTagIndex = item.categories.indexOf(SystemStreamIDs.READ);
                if (starredTagIndex > -1) {
                  item.categories.splice(starredTagIndex, 1);
                } else {
                  item.categories.push(SystemStreamIDs.READ);
                }
              }
              pendingIds.push(item.id);
            });
        })
      );
      try {
        await services.inoreader.markArticleAsRead(pendingIds, !isRead);
      } catch (e) {
        // 回滚
        queryClient.setQueryData(queryKey, previousData);
        throw e;
      }
    },
    [queryClient, queryKey]
  );

  const markItemAsStar = useCallback(async (target: StreamContentItemWithPageIndex) => {
    const previousData = queryClient.getQueryData<InfiniteData<StreamContentsResponse>>(queryKey);
    queryClient.setQueryData<InfiniteData<StreamContentsResponse>>(
      queryKey,
      produce<InfiniteData<StreamContentsResponse>>((draft) => {
        const { items } = draft.pages[target.pageIndex];
        const draftTarget = items.find(({ id }) => id === target.id);
        if (draftTarget) {
          const starredTagIndex = draftTarget.categories.indexOf(SystemStreamIDs.STARRED);
          if (starredTagIndex > -1) {
            draftTarget.categories.splice(starredTagIndex, 1);
          } else {
            draftTarget.categories.push(SystemStreamIDs.STARRED);
          }
        }
      })
    );
    try {
      await services.inoreader.markArticleAsRead(target.id, target.isRead);
    } catch (e) {
      // 回滚
      queryClient.setQueryData(queryKey, previousData);
      throw e;
    }
  }, []);

  return useMemo(() => {
    return {
      markItemAsRead,
      markAboveAsRead,
      markItemAsStar,
    };
  }, [markAboveAsRead, markItemAsRead, markItemAsStar]);
};
