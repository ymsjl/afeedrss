
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

export class SubscriptionNavTreeBuilder {
  static getTagNameFromId = (tagId: string): string => {
    const slice: string[] = tagId.split("/");
    return slice[slice.length - 1];
  };

  subscriptionStreamDictionary: SubscriptionStreamDictionary;

  constructor({
    subscriptionById,
    tagsById,
    streamPrefById,
  }: {
    subscriptionById: Record<string, Subscription>;
    tagsById: Record<string, Folder>;
    streamPrefById: Record<string, IdValuePair[]>;
  }) {
    this.subscriptionStreamDictionary = new SubscriptionStreamDictionary({ subscriptionById, tagsById, streamPrefById })
  }

  public build(rootStreamId: string) {
    const links = this.buildCore(this.subscriptionStreamDictionary.getChildrenByStreamId(rootStreamId));
    links.unshift(
      this.createBuildInNavLink({ id: rootStreamId, name: "all article", }),
      this.createBuildInNavLink({ id: SystemStreamIDs.STARRED, name: "stared article", })
    );
    return [{ links, }];
  }

  private buildCore(items: SortableIdentifiableItem[]): INavLink[] {
    const result: INavLink[] = [];
    for (const item of items) {
      const link = this.dispatchCreateLink(item);
      if (link) result.push(link);
    }
    return result;
  }

  private createTagLink(item: Tag): INavLink | null {
    return {
      name: SubscriptionNavTreeBuilder.getTagNameFromId(item.id),
      key: item.id,
      url: "",
      type: "tag",
      unreadCount: item.unreadCount,
    };
  }

  private createFolderLink(item: Folder): INavLink | null {
    return {
      name: SubscriptionNavTreeBuilder.getTagNameFromId(item.id),
      key: item.id,
      url: "",
      type: "folder",
      unreadCount: item.unreadCount,
      links: this.buildCore(this.subscriptionStreamDictionary.getChildrenByStreamId(item.id)),
    };
  }

  private createBuildInNavLink({ name, id }: Pick<INavLink, 'id' | 'name'>): INavLink {
    return {
      name,
      key: id,
      url: "",
      type: "buildIn",
    };
  };

  private createSubscriptionLink(subscription: Pick<INavLink, 'id' | 'title' | 'iconUrl'>): INavLink {
    return {
      name: subscription.title ?? '',
      key: subscription.id,
      url: "",
      type: "feed",
      iconUrl: subscription.iconUrl,
    };
  };


  private dispatchCreateLink(item: (Subscription | FolderOrTag | Folder)): INavLink | null {
    if (isSubscription(item)) {
      return this.createSubscriptionLink(item);
    } else if (isTag(item)) {
      return this.createTagLink(item);
    } else if (isFolder(item)) {
      return this.createFolderLink(item);
    } else {
      return null
    }
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
  return isSortableIdentifiable(item) && ('unreadCount' in item) && ('type' in item) && (typeof item.type === 'string');
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

class SubscriptionStreamDictionary {
  static chunck(str: string): string[] {
    return str.match(/.{1,8}/g) || [];
  }

  subscriptionStreams: Record<string, Folder | Subscription | FolderOrTag> = {};
  streamPrefs: Record<string, IdValuePair[]> = {};

  constructor({
    subscriptionById,
    tagsById,
    streamPrefById,
  }: {
    subscriptionById: Record<string, Subscription>;
    tagsById: Record<string, Folder>;
    streamPrefById: Record<string, IdValuePair[]>;
  }) {
    this.streamPrefs = streamPrefById;
    Object.assign(
      this.subscriptionStreams,
      keyBySortId(subscriptionById),
      keyBySortId(tagsById)
    )
  }

  public getChildrenByStreamId(streamId: string): (Folder | FolderOrTag | Subscription)[] {
    const SubscriptionOrdering = this.getSubscriptionOrdering(streamId);
    const reuslt = SubscriptionStreamDictionary.chunck(SubscriptionOrdering).map(sortId => this.subscriptionStreams[sortId])
    console.log('getChildrenByStreamId', streamId, reuslt);
    return reuslt;
  }

  private getSubscriptionOrdering(streamId: string): string {
    const preference = this.streamPrefs[streamId];
    if (!preference || preference.length < 1) return '';
    return preference[preference.length - 1].value;
  }
}