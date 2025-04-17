import { IdValuePair, SystemStreamIDs, } from "@server/inoreader/stream.types";
import { Subscription, Sortable, SortableIdentifiableItem, Tag, Folder, FolderOrTag } from "@/server/inoreader/subscription.types";

export interface INavLink {
  name: string;
  url: string;
  key?: string;
  links?: INavLink[];
  type: 'feed' | 'tag' | 'folder' | 'buildIn';
  unreadCount?: number;
  iconUrl?: string;
  isCollapsed?: boolean;
  isExpanded?: boolean;
  title?: string;
  [propertyName: string]: any;
}

// 处理创建NavLink的工厂类
export class NavLinkFactory {
  static getTagNameFromId = (tagId: string): string => {
    const slice: string[] = tagId.split("/");
    return slice[slice.length - 1];
  };
  
  static createTagLink(item: Tag): INavLink {
    return {
      name: NavLinkFactory.getTagNameFromId(item.id),
      key: item.id,
      url: "",
      type: "tag",
      unreadCount: item.unread_count,
    };
  }

  static createFolderLink(item: Folder, children: INavLink[]): INavLink {
    return {
      name: NavLinkFactory.getTagNameFromId(item.id),
      key: item.id,
      url: "",
      type: "folder",
      unreadCount: item.unread_count,
      links: children,
    };
  }

  static createBuildInNavLink({ name, id }: Pick<INavLink, 'id' | 'name'>): INavLink {
    return {
      name,
      key: id,
      url: "",
      type: "buildIn",
    };
  }

  static createFeedLink(feed: Pick<INavLink, 'id' | 'title' | 'iconUrl'>): INavLink {
    return {
      name: feed.title ?? '',
      key: feed.id,
      url: "",
      type: "feed",
      iconUrl: feed.iconUrl,
    };
  }

  static createNavLink(item: SortableIdentifiableItem, children?: INavLink[]): INavLink | null {
    if (isSubscription(item)) {
      return NavLinkFactory.createFeedLink(item);
    } else if (isTag(item)) {
      return NavLinkFactory.createTagLink(item);
    } else if (isFolder(item)) {
      return NavLinkFactory.createFolderLink(item, children || []);
    } else {
      return null;
    }
  }
}
type AfFeed = {

}

type AfRootFolder = {
  children: (AfFeed | AfFeedFolder)[];
}

type AfFeedFolder = {
  children: AfFeed[];
}

type AfTag = {
  children: AfFeed[];
}

export class FeedTreeBuilder {
  streamDictionary: StreamDictionary;

  constructor({
    feedsById,
    tagsById,
    streamPrefById,
  }: {
    feedsById: Record<string, Subscription>;
    tagsById: Record<string, Folder>;
    streamPrefById: Record<string, IdValuePair[]>;
  }) {
    this.streamDictionary = new StreamDictionary({ feedsById, tagsById, streamPrefById })
  }

  public build(rootStreamId: string) {
    const links = this.buildCore(this.streamDictionary.getChildrenByStreamId(rootStreamId));
    links.unshift(
      NavLinkFactory.createBuildInNavLink({ id: rootStreamId, name: "all article", }),
      NavLinkFactory.createBuildInNavLink({ id: SystemStreamIDs.STARRED, name: "stared article", })
    );
    return [{ links, }];
  }

  private buildCore(items: SortableIdentifiableItem[]): INavLink[] {
    const result: INavLink[] = [];
    for (const item of items) {
      if (isFolder(item)) {
        // 对于文件夹类型，先递归构建子节点
        const children = this.buildCore(this.streamDictionary.getChildrenByStreamId(item.id));
        const link = NavLinkFactory.createNavLink(item, children);
        if (link) result.push(link);
      } else {
        // 对于其他类型，直接创建节点
        const link = NavLinkFactory.createNavLink(item);
        if (link) result.push(link);
      }
    }
    return result;
  }

  public travarse(){
    
  }
}

const isSortable = (item: any): item is Sortable => {
  return item && (typeof item === 'object') && ('sortid' in item) && (typeof item.sortid === 'string');
}

const isIdentifiable = (item: any): item is { id: string } => {
  return item && (typeof item === 'object') && ('id' in item) && (typeof item.id === 'string');
}

const isSortableIdentifiable = (item: any): item is SortableIdentifiableItem => {
  return isSortable(item) && isIdentifiable(item);
};

const isSubscription = (item: any): item is Subscription => {
  return isSortableIdentifiable(item) && ('title' in item && typeof item.title === 'string') && ('iconUrl' in item) && (typeof item.iconUrl === 'string');
};

const isInoreaderTag = (item: any): item is FolderOrTag => {
  return isSortableIdentifiable(item) && ('unread_count' in item) && ('type' in item) && (typeof item.type === 'string');
}

const isFolder = (item: any): item is Folder => {
  return isInoreaderTag(item) && (item.type === 'folder');
}

const isTag = (item: any): item is Tag => {
  return isInoreaderTag(item) && item.type === 'tag';
}

const keyBySortId = <T extends Sortable>(sortableDict: Record<string, T>) =>
  Object.values(sortableDict).reduce((acc, sortableItem) => {
    if (sortableItem.sortid) acc[sortableItem.sortid] = sortableItem;
    return acc;
  }, {} as Record<string, T>);

class StreamDictionary {
  static chunck(str: string): string[] {
    return str.match(/.{1,8}/g) || [];
  }

  streams: Record<string, Folder | Subscription | FolderOrTag> = {};
  streamPrefs: Record<string, IdValuePair[]> = {};

  constructor({
    feedsById: subscriptionById,
    tagsById,
    streamPrefById,
  }: {
    feedsById: Record<string, Subscription>;
    tagsById: Record<string, Folder>;
    streamPrefById: Record<string, IdValuePair[]>;
  }) {
    this.streamPrefs = streamPrefById;
    Object.assign(
      this.streams,
      keyBySortId(subscriptionById),
      keyBySortId(tagsById)
    )
  }

  public getChildrenByStreamId(streamId: string): (Folder | FolderOrTag | Subscription)[] {
    const SubscriptionOrdering = this.getSubscriptionOrdering(streamId);
    const reuslt = StreamDictionary.chunck(SubscriptionOrdering).map(sortId => this.streams[sortId])
    return reuslt;
  }

  private getSubscriptionOrdering(streamId: string): string {
    const preference = this.streamPrefs[streamId];
    if (!preference || preference.length < 1) return '';
    return preference[preference.length - 1].value;
  }
}