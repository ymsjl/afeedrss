import { IdValuePair, SystemStreamIDs } from "../server/inoreader";
import { Subscription, Folder, Sortable, KeyValuePair, Tag } from "../types";

export interface INavLink {
    /**
     * Text to render for this link
     */
    name: string;
    /**
     * URL to navigate to for this link
     */
    url: string;
    /**
     * Unique, stable key for the link, used when rendering the list of links and for tracking
     * the currently selected link.
     */
    key?: string;
    /**
     * Child links to this link, if any
     */
    links?: INavLink[];
    /**
     * Callback invoked when this link is clicked. Providing this callback will cause the link
     * to render as a button (rather than an anchor) unless forceAnchor is set to true.
     */
    onClick?: (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => void;
    /**
     * The name to use for functional automation tests
     */
    automationId?: string;
    /**
     * Whether or not the link is in an expanded state
     */
    isExpanded?: boolean;
    /**
     * Aria-current token for active nav links. Must be a valid token value, and defaults to 'page'.
     */
    ariaCurrent?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true';
    /**
     * Aria label for nav link. Ignored if `collapseAriaLabel` or `expandAriaLabel` is provided.
     */
    ariaLabel?: string;
    /**
     * Text for title tooltip and ARIA description.
     */
    title?: string;
    /**
     * Link <a> target.
     */
    target?: string;
    /**
     * Whether or not the link is disabled.
     */
    disabled?: boolean;
    /**
     * (Optional) By default, any link with onClick defined will render as a button.
     * Set this property to true to override that behavior. (Links without onClick defined
     * will render as anchors by default.)
     */
    forceAnchor?: boolean;
    /**
     * ARIA label when group is collapsed and can be expanded.
     */
    expandAriaLabel?: string;
    /**
     * ARIA label when group is collapsed and can be expanded.
     */
    collapseAriaLabel?: string;
    /**
     * (Optional) Any additional properties to apply to the rendered links.
     */
    [propertyName: string]: any;
}

export const getTagNameFromId = (tagId: string): string => {
  const slice: string[] = tagId.split("/");
  return slice[slice.length - 1];
};

const createLink = (subscription: Subscription): INavLink => {
  return {
    name: subscription.title,
    key: subscription.id,
    url: "",
    type: "feed",
    iconUrl: subscription.iconUrl,
  };
};

export const createBuildInNavLink = ({
  name,
  id,
  iconName,
}: {
  name: string;
  id: string;
  iconName: string;
}): INavLink => {
  return {
    name,
    key: id,
    url: "",
    type: "buildIn",
  };
};

const createTagLink = (tag: Tag): INavLink => {
  return {
    name: getTagNameFromId(tag.id),
    key: tag.id,
    url: "",
    type: "tag",
    unreadCount: tag.unread_count,
  };
};

const createFolderLink = (
  tag: Tag,
  links: INavLink[],
  id?: string
): INavLink => {
  if (!tag && id) {
    const name = getTagNameFromId(id);
    return {
      name,
      links: links,
      key: id,
      url: "",
      type: "folder",
    };
  } else {
    const name = getTagNameFromId(tag.id);
    return {
      name: name,
      links: links,
      key: tag.id,
      url: "",
      type: "folder",
      unreadCount: tag?.unread_count,
    };
  }
};

export default class SubscriptionNavTreeBuilder {
  rootId: string = "";
  subscriptionById: KeyValuePair<Subscription> = {};
  tagsById: KeyValuePair<Folder> = {};
  streamPrefById: KeyValuePair<IdValuePair[]> = {};
  sortIdToId: KeyValuePair<string> = {};

  constructor({
    userId,
    subscriptionById,
    tagsById,
    streamPrefById,
  }: {
    userId: string;
    subscriptionById: KeyValuePair<Subscription>;
    tagsById: KeyValuePair<Folder>;
    streamPrefById: KeyValuePair<IdValuePair[]>;
  }) {
    this.rootId = `user/${userId}/state/com.google/root`;
    this.subscriptionById = subscriptionById;
    this.tagsById = tagsById;
    this.streamPrefById = streamPrefById;
    for (const key in subscriptionById) {
      if (Object.prototype.hasOwnProperty.call(subscriptionById, key)) {
        const element = subscriptionById[key];
        this.sortIdToId[element.sortid] = key;
      }
    }
    for (const key in tagsById) {
      if (Object.prototype.hasOwnProperty.call(tagsById, key)) {
        const element = tagsById[key];
        this.sortIdToId[element.sortid] = key;
      }
    }
  }

  static chunck(str: string): string[] {
    return str.match(/.{1,8}/g) || [];
  }

  static getSort(streamPref: IdValuePair[]): string {
    return !streamPref || streamPref.length < 1
      ? ""
      : streamPref[streamPref.length - 1].value;
  }

  static isSubscriptonId(id: string): boolean {
    return !!id && id.startsWith("feed/");
  }

  build() {
    const sortArr = this.getSortArr(this.rootId);
    const links = this.buildCore(sortArr);
    links.unshift(
      createBuildInNavLink({
        id: this.rootId,
        name: "all article",
        iconName: "PreviewLink",
      }),
      createBuildInNavLink({
        id: SystemStreamIDs.STARRED,
        name: "stared article",
        iconName: "FavoriteStar",
      })
    );
    return [
      {
        links,
      },
    ];
  }

  getIdBySortId(sortId: string) {
    return this.sortIdToId[sortId];
  }

  getStreamPref(id: string) {
    return this.streamPrefById[id];
  }

  getTag(id: string) {
    return this.tagsById[id];
  }

  getSubscription(id: string) {
    return this.subscriptionById[id];
  }

  getSortArr(id: string): string[] {
    const streamPref = this.getStreamPref(id);
    if (streamPref) {
      const sort = SubscriptionNavTreeBuilder.getSort(streamPref);
      return SubscriptionNavTreeBuilder.chunck(sort);
    }
    return [];
  }

  private buildCore(sortArr: string[]): INavLink[] {
    const result: INavLink[] = [];
    for (const sortId of sortArr) {
      const id = this.getIdBySortId(sortId);
      let link = null;
      if (SubscriptionNavTreeBuilder.isSubscriptonId(id)) {
        const subscrption = this.getSubscription(id);
        link = createLink(subscrption);
      } else {
        const tag = this.getTag(id);
        if (tag.type === "tag") {
          link = createTagLink(tag);
        } else if (tag.type === "folder") {
          const _sortArr = this.getSortArr(id);
          const links = this.buildCore(_sortArr);
          link = createFolderLink(tag, links, id);
        }
      }
      if (link) {
        result.push(link);
      }
    }
    return result;
  }
}
