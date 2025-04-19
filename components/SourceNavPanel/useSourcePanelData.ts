import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FeedTreeBuilder } from "./FeedTreeBuilder";
import { streamPreferencesQueryOptions, subscriptionsQueryOptions, folderQueryOptions } from "@server/inoreader/subscription.rquery";
import { getRootStreamId } from './../StreamContentPanel/getStreamContentQueryKey';
import { useAppStore } from "@/app/providers/AppStoreProvider";

export const useSourcePanelData = () => {
  const userId = useAppStore(store => store.session?.user?.id || "");
  const streamPreferencesQuery = useSuspenseQuery(streamPreferencesQueryOptions);
  const folderQuery = useSuspenseQuery(folderQueryOptions);
  const subscriptionsQuery = useSuspenseQuery(subscriptionsQueryOptions);

  const subscriptionsData = subscriptionsQuery.data;
  const folderData = folderQuery.data;
  const streamPreferencesData = streamPreferencesQuery.data;
  const data = useMemo(() => {
    if (
      !userId ||
      !subscriptionsData ||
      !folderData ||
      !streamPreferencesData
    ) {
      return null;
    }
    return new FeedTreeBuilder({
      feedsById: subscriptionsData.entities.subscription,
      tagsById: folderData.entities.folder,
      streamPrefById: streamPreferencesData.streamprefs,
    }).build(getRootStreamId(userId));
  }, [userId, subscriptionsData, folderData, streamPreferencesData]);

  return useMemo(
    () => ({
      data,
    }),
    [data]
  );
};