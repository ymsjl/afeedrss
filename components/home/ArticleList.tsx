import React from "react";
import { useRouter } from "next/router";
import { Spinner, List, ListItem } from "@fluentui/react-components";
import { StreamContentItem } from "../../server/inoreader";
import StatusCard, { Status } from "../statusCard";
import ArticleListItem, { useListClasses } from "./ArticleListItem";

interface StreamContentItemWithPageIndex extends StreamContentItem {
  pageIndex: number;
}

interface ArticleListProps {
  items: StreamContentItemWithPageIndex[];
  isFetched: boolean;
  error: unknown;
  isFetching: boolean;
  showFeedThumbnail: boolean;
  curArticle: StreamContentItem | null;
  onMarkAsRead: (item: StreamContentItemWithPageIndex) => void;
  onMarkAboveAsRead: (
    item: StreamContentItemWithPageIndex,
    isRead: boolean
  ) => void;
  onSelectArticle: (item: StreamContentItem) => void;
}

export const ArticleList: React.FC<ArticleListProps> = ({
  items,
  isFetched,
  error,
  isFetching,
  showFeedThumbnail,
  curArticle,
  onMarkAsRead,
  onMarkAboveAsRead,
  onSelectArticle,
}) => {
  const router = useRouter();
  const listClasses = useListClasses();

  if (isFetched) {
    if (error) {
      return <StatusCard status={Status.ERROR} content="出错了" />;
    } else if (items.length === 0) {
      return <StatusCard status={Status.EMPTY} content="这里是空的" />;
    }
  }

  return (
    <>
      <List className={listClasses.list}>
        {items.map((item) => {
          if (!item) return null;
          return (
            <ListItem key={item.id}>
              <ArticleListItem
                item={item}
                isSelected={curArticle?.id === item.id}
                showFeedThumbnail={showFeedThumbnail}
                onMarkAsRead={onMarkAsRead}
                onMarkAboveAsRead={onMarkAboveAsRead}
                onSelectArticle={(selectedItem: StreamContentItem) => {
                  const href = `/?articleId=${selectedItem.id}`;
                  router.push(href, href, { shallow: true });
                  onSelectArticle(selectedItem);
                  if (!selectedItem.isRead) {
                    onMarkAsRead(item);
                  }
                }}
              />
            </ListItem>
          );
        })}
      </List>
      <div className="flex justify-center w-full p-4">
        {isFetching && <Spinner />}
      </div>
    </>
  );
};
