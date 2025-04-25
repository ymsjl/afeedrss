import { Folder, Sortable, Subscription } from "@services/inoreader/subscription.types";
import { Dayjs } from "dayjs";

// 主题类型定义
export type AppTheme = 'light' | 'dark';

export interface FeedItem {
  id: string;
  title: string;
  summary?: string;
  thumbnailSrc?: string;
  content?: string;
  url?: string;
  sourceName?: string;
  sourceID?: string;
  publishedTime: Dayjs;
  isRead?: boolean;
  isStar?: boolean;
  isInnerArticleShow?: boolean;
}

export interface Tag extends Sortable {
  id: string;
  type?: string;
  unread_count?: number;
  unseen_count?: number;
}

export interface FeedGroup {
  id: string;
  name: string;
  children: any[];
}

export interface FeedProps extends FeedItem {
  className?: string;
  rootClassName?: string;
  itemClassName?: string;
}

export interface KeyValuePair<T> {
  [key: string]: T;
}

export interface SubscriptionEntity {
  subscription: { [key: string]: Subscription };
}

export interface FolderEntity {
  folder: { [key: string]: Folder };
}