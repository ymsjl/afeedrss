export interface StreamContentsParams {
  n?: number; // Number of items to return (default 20, max 1000)
  r?: string; // Order. By default, it is newest first. You can pass o here to get oldest first
  ot?: number; // Start time (unix timestamp)
  xt?: string; // Exclude Target
  it?: string; // Include Target
  c?: string; // Continuation
  output?: string; // Output format (json or xml)
  includeAllDirectStreamIds?: boolean; // Set this to false if you want to receive only manually added tags in the categories list. Otherwise automatically added tags from the folders will be populated there too.
  annotations?: boolean; // Set this to 1 or true if you want to get an array of your annotations for each article.
}


export interface StreamPreferenceListResponse {
  streamprefs: {
    [key: string]: IdValuePair[];
  };
}

export interface Linkable {
  href: string;
}

export interface StreamContentItem {
  alternate?: (Linkable & { type: string; })[];
  annotations: any[];
  author: string;
  canonical: (Linkable & { title: string; })[];
  categories: string[];
  comments?: any[];
  commentsNum: number;
  crawlTimeMsec: string;
  id: string;
  likingUsers?: any[];
  origin: {
    htmlUrl: string;
    streamId: string;
    title: string;
  };
  published: number;
  summary: {
    direction: TextDirection;
    content: string;
  };
  timestampUsec: string;
  title: string;
  updated: number;
  isRead?: boolean;
}

export interface StreamContentsResponse {
  items: StreamContentItem[];
  continuation: string;
  description: string;
  direction: TextDirection;
  id: string;
  self: Linkable;
  title: string;
  updated: number;
}

export type TextDirection = "auto" | "ltr" | "rtl";

export interface IdValuePair {
  id: string;
  value: string;
}

export enum FeedActionType {
  edit = "edit",
  subscribe = "subscribe",
  unsubscribe = "unsubscribe",
  markAsRead = "user/-/state/com.google/read",
  markAsUnread = "user/-/state/com.google/unread",
  markAsStar = "user/-/state/com.google/starred",
  markAsUnstar = "user/-/state/com.google/unstarred"
}

export enum SystemStreamIDs {
  READ = "user/-/state/com.google/read",// Read articles.
  STARRED = "user/-/state/com.google/starred",// Starred articles.
  BROADCAST = "user/-/state/com.google/broadcast",// Broadcasted articles.
  ANNOTATIONS = "user/-/state/com.google/annotations",// Annotated articles.
  LIKE = "user/-/state/com.google/like",// Likes articles.
  SAVE_WEB_PAGES = "user/-/state/com.google/saved-web-pages"
}

export interface MarkArticleParmas {
  i: string | string[];
  a?: SystemStreamIDs;
  r?: SystemStreamIDs;
}

