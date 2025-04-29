import { Sortable, SortableIdentifiableItem, Subscription, FolderOrTag, FolderWithChildren, Folder, Tag } from "@/services/subscription";

const isSortable = (item: any): item is Sortable => {
  return item && (typeof item === 'object') && ('sortid' in item) && (typeof item.sortid === 'string');
};

const isIdentifiable = (item: any): item is { id: string; } => {
  return item && (typeof item === 'object') && ('id' in item) && (typeof item.id === 'string');
};

const isSortableIdentifiable = (item: any): item is SortableIdentifiableItem => {
  return isSortable(item) && isIdentifiable(item);
};

export const isSubscription = (item: any): item is Subscription => {
  return isSortableIdentifiable(item) && ('title' in item && typeof item.title === 'string') && ('iconUrl' in item) && (typeof item.iconUrl === 'string');
};

const isInoreaderTag = (item: any): item is FolderOrTag => {
  return isSortableIdentifiable(item) && ('unread_count' in item) && ('type' in item) && (typeof item.type === 'string');
};

export const isFolder = (item: any): item is Folder => {
  return isInoreaderTag(item) && (item.type === 'folder');
};

export const isTag = (item: any): item is Tag => {
  return isInoreaderTag(item) && item.type === 'tag';
};

export const isFolderWithChildren = (item: any): item is FolderWithChildren => {
  return isFolder(item) && 'children' in item && Array.isArray(item.children);
};
