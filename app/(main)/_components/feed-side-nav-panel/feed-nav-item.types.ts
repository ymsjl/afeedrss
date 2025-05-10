type NavItemType = 'feed' | 'tag' | 'folder' | 'buildIn';

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
