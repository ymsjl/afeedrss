import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { subscriptionsQueryOptions, folderQueryOptions } from "@/services/subscription/subscription.rquery";
import { streamPreferencesQueryOptions  } from "@/services/stream/stream.rquery";
import { getRootStreamId } from "@/features/stream-content/get-root-stream-id";
import { useAppStore } from "@/app/providers/app-store-provider";
import { createFeedTree } from '@/features/subscription-source/create-feed-tree';
import { SystemStreamIDs } from '@/services/stream';
import { FolderWithChildren, Tag, Subscription } from "@/services/subscription";
import { isSubscription, isTag, isFolderWithChildren } from "@features/subscription-source/utils";
import { getTagNameFromId } from "@/features/subscription-source/utils";
import { INavItem } from "./feed-nav-item.types";

export const useFeedNavTreeData = () => {
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
    navList.unshift(createBuildInNavItem({ name: '星标文章', key: SystemStreamIDs.STARRED }))
    navList.unshift(createBuildInNavItem({ name: '全部文章', key: rootStreamId }))
    return navList
  }, [userId, subscriptionsData, folderData, streamPreferencesData]);

  return useMemo(
    () => ({
      data,
    }),
    [data]
  );
};

function createTagNavItem(item: Tag): INavItem {
  const name = getTagNameFromId(item.id);
  const type = "tag";
  return {
    name,
    key: item.id,
    type,
    unreadCount: item.unread_count,
  };
}

function createFolderNavItem(item: FolderWithChildren): INavItem {
  const links: INavItem[] = []
  item.children.forEach((child) => {
    const link = createNavItem(child);
    link && links.push(link);
  })
  const name = getTagNameFromId(item.id);
  const type = "folder";
  return {
    name,
    key: item.id,
    type,
    unreadCount: item.unread_count,
    links,
  };
}

function createFeedNavItem(feed: Pick<Subscription, 'id' | 'title' | 'iconUrl'>): INavItem {
  return {
    name: feed.title ?? '',
    key: feed.id,
    type: "feed",
    iconUrl: feed.iconUrl,
  };
}

function createNavItem(data: (Subscription | Tag | FolderWithChildren | null)) {
  if (isSubscription(data)) {
    return createFeedNavItem(data);
  } else if (isTag(data)) {
    return createTagNavItem(data);
  } else if (isFolderWithChildren(data)) {
    return createFolderNavItem(data);
  } else {
    return null;
  }
}

function createBuildInNavItem({ name, key }: Pick<INavItem, 'key' | 'name'>): INavItem {
  return {
    name,
    key,
    type: "buildIn",
  };
}

function createNavList(list: (Subscription | Tag | FolderWithChildren | null)[]) {
  const result: INavItem[] = [];
  list.forEach((item) => {
    const navItem = createNavItem(item);
    if (navItem) {
      result.push(navItem);
    }
  })
  return result;
}
