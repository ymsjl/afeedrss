import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { streamPreferencesQueryOptions, subscriptionsQueryOptions, folderQueryOptions } from "@server/inoreader/subscription.rquery";
import { getRootStreamId } from "../stream-content/get-root-stream-id";
import { useAppStore } from "@/app/providers/app-store-provider";
import { createFeedTree } from './create-feed-tree';
import { createBuildInNavItem, createNavList } from "../../app/(main)/_components/feed-side-nav/create-nav";
import { SystemStreamIDs } from '@server/inoreader/stream.types';

export const useFeedSideNavData = () => {
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
    const rootStreamId = getRootStreamId(userId)
    const feedTree = createFeedTree(rootStreamId, {
      feedsById: subscriptionsData.entities.subscription,
      tagsById: folderData.entities.folder,
      streamPrefById: streamPreferencesData.streamprefs,
    })
    const navList = createNavList(feedTree);
    navList.unshift(createBuildInNavItem({ name: '全部文章', key: rootStreamId }))
    navList.unshift(createBuildInNavItem({ name: '星标文章', key: SystemStreamIDs.STARRED }))
    return navList
  }, [userId, subscriptionsData, folderData, streamPreferencesData]);

  return useMemo(
    () => ({
      data,
    }),
    [data]
  );
};