import { FeedActionType } from "./stream.types";

export interface SubscriptionListResponse {
  subscriptions: Subscription[];
}

export interface SubscriptionEditParams {
  ac: FeedActionType;
  s: string;
  a?: string;
  t?: string;
}

export interface FolderTagListParams {
  types?: number;
  counts?: number;
}

export interface InoreaderTagListResponse {
  tags: FolderOrTag[];
}

export interface Category {
  id: string;
  label: string;
}

export interface Identifiable {
  id: string;
}

export interface Sortable {
  sortid: string;
}

export interface SortableIdentifiableItem extends Sortable, Identifiable{}

export interface Subscription extends SortableIdentifiableItem {
  title: string;
  iconUrl?: string;
  firstitemmsec: number;
  url: string;
  htmlUrl: string;
  categories: Category[];
}

export interface FolderOrTag extends SortableIdentifiableItem {
  type?: InoreaderTagType;
  unread_count?: number;
  unseen_count?: number;
}

export interface Folder extends FolderOrTag {
  type?: "folder";
  isCollapsed?: boolean;
}

export interface Tag extends FolderOrTag {
  type?: "tag";
}

export type InoreaderTagType = "tag" | "folder" | "active_search" | 'buildIn';

export interface FolderWithChildren extends Folder {
  children: (Subscription | Tag | FolderWithChildren)[];
}