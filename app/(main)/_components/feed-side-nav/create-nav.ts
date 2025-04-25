import { FolderWithChildren, Tag, Subscription } from "@services/inoreader/subscription.types";
import { isSubscription, isTag, isFolderWithChildren } from "@features/subscription-source/utils";

export function getTagNameFromId(tagId: string) {
  const slice: string[] = tagId.split("/");
  return slice[slice.length - 1];
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

export function createBuildInNavItem({ name, key }: Pick<INavItem, 'key' | 'name'>): INavItem {
  return {
    name,
    key,
    type: "buildIn",
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

export function createNavList(list: (Subscription | Tag | FolderWithChildren | null)[]) {
  const result: INavItem[] = [];
  list.forEach((item) => {
    const navItem = createNavItem(item);
    if (navItem) {
      result.push(navItem);
    }
  })
  return result;
}

export type NavItemType = 'feed' | 'tag' | 'folder' | 'buildIn'

export interface INavItem {
  name: string;
  key?: string;
  links?: INavItem[];
  type: NavItemType;
  iconUrl?: string;
  unreadCount?: number;
  isCollapsed?: boolean;
  isExpanded?: boolean;
}
