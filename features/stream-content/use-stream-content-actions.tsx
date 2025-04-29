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

  const toggleItemTag = useCallback(
    async (target: StreamContentItemWithPageIndex, tag: string) => {
      const previousData = queryClient.getQueryData<InfiniteData<StreamContentsResponse>>(queryKey);
      const tagIndex = target.categories.indexOf(tag);
      queryClient.setQueryData<InfiniteData<StreamContentsResponse>>(
        queryKey,
        produce<InfiniteData<StreamContentsResponse>>((draft) => {
          const { items } = draft.pages[target.pageIndex];
          const draftTarget = items.find(({ id }) => id === target.id);
          if (draftTarget === null || draftTarget === undefined) return;
          if (tagIndex > -1) {
            draftTarget.categories.splice(tagIndex, 1);
          } else {
            draftTarget.categories.push(tag);
          }
        })
      );
      try {
        await services.inoreader.editArticleTag(target.id, tag, tagIndex < 0);
      } catch (e) {
        queryClient.setQueryData(queryKey, previousData);
        throw e;
      }
    }, [])


  const markItemAsRead = useCallback((target: StreamContentItemWithPageIndex) => toggleItemTag(target, SystemStreamIDs.READ), [toggleItemTag]);

  const markItemAsStar = useCallback(async (target: StreamContentItemWithPageIndex) => toggleItemTag(target, SystemStreamIDs.STARRED), [toggleItemTag]);

  const markAboveAsRead = useCallback(
    async (target: StreamContentItemWithPageIndex, isRead = true) => {
      const pendingIds: string[] = [];
      const tag = SystemStreamIDs.READ;
      const previousData = queryClient.getQueryData<InfiniteData<StreamContentsResponse>>(queryKey);
      queryClient.setQueryData(
        queryKey,
        produce<InfiniteData<StreamContentsResponse>>((draft) => {
          const itemsToUpdate = [];
          for (const pageIndex in draft.pages) {
            if (!Object.prototype.hasOwnProperty.call(draft.pages, pageIndex)) return;
            const { items } = draft.pages[pageIndex];
            if (Number(pageIndex) < target.pageIndex) {
              itemsToUpdate.push(...items);
            } else if (Number(pageIndex) === target.pageIndex) {
              const targetIndex = items.findIndex(({ id }) => id === target.id);
              itemsToUpdate.push(...items.slice(0, targetIndex));
            }
          }
          itemsToUpdate
            .forEach((item) => {
              const tagIndex = item.categories.indexOf(tag);
              if (tagIndex === - 1 && !isRead) return;
              if (tagIndex > - 1 && isRead) return;
              if (isRead) {
                item.categories.push(tag);
              } else {
                item.categories.splice(tagIndex, 1);
              }
              pendingIds.push(item.id);
            });
        })
      );

      try {
        await services.inoreader.editArticleTag(pendingIds, tag, isRead);
      } catch (e) {
        queryClient.setQueryData(queryKey, previousData);
        throw e;
      }
    },
    [queryClient, queryKey]
  );

  return useMemo(() => {
    return {
      markItemAsRead,
      markAboveAsRead,
      markItemAsStar,
    };
  }, [markAboveAsRead, markItemAsRead, markItemAsStar]);
};
