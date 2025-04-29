import { IdValuePair, } from "@/services/stream";
import { Subscription, Sortable, SortableIdentifiableItem, Tag, Folder, FolderOrTag, FolderWithChildren } from "@/services/subscription";
import { isFolder, isSubscription, isTag } from "./utils";

export function createFeedTree(rootStreamId: string, {
  feedsById,
  tagsById,
  streamPrefById,
}: {
  feedsById: Record<string, Subscription>;
  tagsById: Record<string, Folder>;
  streamPrefById: Record<string, IdValuePair[]>;
}) {
  const dict = createSortedItemDict({
    feedsById,
    tagsById,
    streamPrefById,
  })

  function createNode(item: SortableIdentifiableItem) {
    if (isFolder(item)) {
      return createFolderNode(item);
    } else if (isSubscription(item) || isTag(item)) {
      return item;
    } else {
      return null;
    }
  }

  function createFolderNode(item: Folder): FolderWithChildren {
    const children: (Subscription | Tag | FolderWithChildren)[] = []
    dict.getChildrenByStreamId(item.id).forEach(child => {
      const node = createNode(child);
      if (node) children.push(node);
    });
    return { ...item, children }
  }

  if (rootStreamId) {
    return dict.getChildrenByStreamId(rootStreamId).map(createNode)
  } else {
    return []
  }
}

function createSortedItemDict({
  feedsById,
  tagsById,
  streamPrefById,
}: {
  feedsById: Record<string, Subscription>;
  tagsById: Record<string, Folder>;
  streamPrefById: Record<string, IdValuePair[]>;
}) {
  function keyBySortId<T extends Sortable>(sortableDict: Record<string, T>) {
    return Object.values(sortableDict).reduce((acc, sortableItem) => {
      if (sortableItem.sortid) acc[sortableItem.sortid] = sortableItem;
      return acc;
    }, {} as Record<string, T>)
  }

  const dict: Record<string, Folder | Subscription | FolderOrTag> = {
    ...keyBySortId(feedsById),
    ...keyBySortId(tagsById)
  }

  function chunck(str: string): string[] {
    return str.match(/.{1,8}/g) || [];
  }

  function getSubscriptionOrdering(streamId: string): string {
    const preference = streamPrefById[streamId];
    if (!preference || preference.length < 1) return '';
    return preference[preference.length - 1].value;
  }

  function getChildrenByStreamId(streamId: string): (Folder | FolderOrTag | Subscription)[] {
    const subscriptionOrdering = getSubscriptionOrdering(streamId);
    const reuslt = chunck(subscriptionOrdering).map(sortId => dict[sortId])
    return reuslt;
  }

  function getItemBySteamId(streamId: string): Subscription | Folder | undefined {
    return feedsById[streamId] ?? tagsById[streamId]
  }

  return {
    getChildrenByStreamId,
    getItemBySteamId,
  }
}