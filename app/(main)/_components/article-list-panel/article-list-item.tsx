'use client'

import React from "react";
import {
  Body1,
  Button,
  Caption1,
  Image,
  Text,
  mergeClasses,
  Avatar,
} from "@fluentui/react-components";
import {
  CheckmarkCircle20Filled,
  Circle20Regular,
  ImageOff20Regular,
  Star20Filled,
  Star20Regular,
} from "@fluentui/react-icons";
import { useLargeThenMobile } from "@/utils/use-large-then-mobile";
import { useAppStore } from "@/app/providers/app-store-provider";
import { filterImgSrcfromHtmlStr } from "@/utils/filterImgSrcfromHtmlStr";
import dayjs from "@/utils/dayjs";
import { StreamContentItemWithPageIndex } from "@/features/stream-content/use-stream-contents-query";
import { Swipeout } from "@components/swipe-out";
import { useClasses, useListClasses, useTwitterLikeItemStyles, useGridItemClasses } from "./article-list-item.style";
import { useFlexClasses } from "@/theme/commonStyles";

interface ArticleListItemProps {
  item: StreamContentItemWithPageIndex;
  isSelected: boolean;
  onMarkAsRead: (item: StreamContentItemWithPageIndex) => void;
  onMarkAsStar: (item: StreamContentItemWithPageIndex) => void;
  onMarkAboveAsRead: (
    item: StreamContentItemWithPageIndex,
    isRead: boolean
  ) => void;
  onSelectArticle: (item: StreamContentItemWithPageIndex) => void;
}

const ArticleListItem: React.FC<ArticleListItemProps> = ({
  item,
  isSelected,
  onMarkAsRead,
  onMarkAsStar,
  onMarkAboveAsRead,
  onSelectArticle,
}) => {
  const { title } = item;
  const classes = useClasses();
  const flexClasses = useFlexClasses();
  const listItemClasses = useListClasses();
  const streamItemDisplayType = useAppStore(state => state.streamItemDisplayType);

  const onRead: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onMarkAsRead(item);
  };

  const onStar: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onMarkAsStar(item);
  };

  const src = filterImgSrcfromHtmlStr(item?.summary?.content ?? '');

  if (streamItemDisplayType === 'pictureOnBottom') {
    return (
      <TwitterLikeItem
        userName={item.origin.title}
        content={item.title.slice(0, 120)}
        avatarUrl={''}
        coverImageUrl={src}
        onClick={() => onSelectArticle(item)}
        isRead={item.isRead}
        onRead={onRead}
        isStarred={item.isStarred}
        onStar={onStar}
        isSelected={isSelected}
      />
    )
  }

  if (streamItemDisplayType === 'grid') {
    return (
      <GridItem
        item={item}
        onClick={() => onSelectArticle(item)}
        isSelected={isSelected}
        onRead={onRead}
        onStar={onStar}
      />
    )
  }

  const renderContent = () => {
    const containerClassName = mergeClasses(
      classes.articleContainer,
      !isSelected && item?.isRead && classes.readArticle,
      streamItemDisplayType === 'textOnly' ? classes.withoutThumbnail : classes.withThumbnail
    );

    if (streamItemDisplayType === 'textOnly') {
      return (
        <div
          className={containerClassName}
          onClick={() => onSelectArticle(item)}
        >
          <Body1
            className={mergeClasses(classes.title, flexClasses.flexGrow)}
            block
            truncate
            wrap={false}
          >
            {title}
          </Body1>
          <Caption1 className={mergeClasses(classes.sourceInfo, flexClasses.flexDisableShrink)} block wrap={false}>
            {`${item.origin.title}/ ${dayjs(
              item?.published * 1000
            ).fromNow()}`}
          </Caption1>
          <div className={classes.readButton}>
            <Button
              icon={item.isRead ? <CheckmarkCircle20Filled /> : <Circle20Regular />}
              appearance="transparent"
              onClick={onRead}
            />
          </div>
        </div>
      )
    }

    return (
      <div
        className={containerClassName}
        onClick={() => onSelectArticle(item)}
      >
        <div className={classes.thumbnailWrapper}>
          {src ? (
            <Image
              src={src}
              className={mergeClasses(classes.thumbnail, classes.thumbnailBackground)}
              alt=""
            />
          ) : <ImageOff20Regular className={classes.imageOff} />}
        </div>
        <div className={classes.contentWrapper}>
          <div className={classes.titleWrapper}>
            <Body1 className={classes.title} block>
              {title}
            </Body1>
          </div>
          <div className={classes.metaInfo}>
            <Caption1 className={mergeClasses(classes.sourceInfo, flexClasses.flexGrow)}>
              {`${item.origin.title}/ ${dayjs(
                item?.published * 1000
              ).fromNow()}`}
            </Caption1>
            <div className={classes.readButton}>
              <Button
                icon={
                  item.isRead ? <CheckmarkCircle20Filled /> : <Circle20Regular />
                }
                appearance="transparent"
                onClick={onRead}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Swipeout
      className={mergeClasses(listItemClasses.listItem, classes.swipeoutContainer, isSelected && classes.selectedItem,)}
      leftBtnsProps={[
        {
          className: classes.swipeoutButtonStar,
          text: "收藏",
          onClick: onStar,
        },
      ]}
      rightBtnsProps={[
        {
          className: classes.leftButton,
          text: "已读",
          onClick: onRead,
        },
      ]}
      overswipeRatio={0.3}
      btnWidth={96}
    >
      {renderContent()}
    </Swipeout>
  );
};

export default ArticleListItem;

interface GridItemProps {
  item: StreamContentItemWithPageIndex;
  isSelected: boolean;
  onClick?: () => void;
  onRead?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onStar?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const GridItem: React.FC<GridItemProps> = (props) => {
  const { item, isSelected, onClick, onRead, onStar } = props;
  const classes = useGridItemClasses();
  const src = filterImgSrcfromHtmlStr(item?.summary?.content ?? '');

  return (
    <div
      className={mergeClasses(
        classes.root,
        item.isRead && classes.isRead,
        isSelected && classes.isSelected
      )}
      onClick={onClick}
    >
      <div className={classes.coverImageWrapper}>
        {src ? (
          <Image
            src={src}
            alt={item.title}
            className={classes.coverImage}
            fit="cover"
          />
        ) : (
          <div className={mergeClasses(classes.coverImagePlaceholder, classes.coverImage)}>
            <ImageOff20Regular />
          </div>
        )}
      </div>
      <div className={mergeClasses(classes.textContent)}>
        <div className={classes.titleRow}>
          <Body1 className={classes.title} title={item.title}>
            {item.title}
          </Body1>
        </div>
        <div className={classes.metaInfo}>
          <Caption1 className={classes.sourceInfo} truncate>
            {item.origin?.title || 'Unknown source'}
          </Caption1>
          <Caption1 className={classes.dateInfo}>
            {dayjs(item.published * 1000).fromNow()}
          </Caption1>
        </div>
      </div>
    </div>
  );
};


interface TwitterItemProps {
  userName: string;
  isRead?: boolean;
  isStarred?: boolean;
  isSelected?: boolean;
  content: string;
  avatarUrl?: string;
  coverImageUrl?: string
  onClick?: () => void;
  onRead?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onStar?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const TwitterLikeItem: React.FC<TwitterItemProps> = (props) => {
  const isLargeThenMobile = useLargeThenMobile();
  const listItemClasses = useListClasses();
  const classes = useClasses();
  const styles = useTwitterLikeItemStyles();
  const { isSelected, isRead, onRead, isStarred, onStar } = props;

  return (
    <div className={
      mergeClasses(
        listItemClasses.listItem,
        isLargeThenMobile && isSelected && classes.selectedItem,
        (!isLargeThenMobile || !isSelected) && isRead && classes.readArticle,
        styles.root
      )}
      onClick={props.onClick}
    >
      {isLargeThenMobile &&
        <div className={styles.sourceRow}>
          <Avatar image={{ src: props.avatarUrl }} />
        </div>
      }
      <div className={styles.contentColum}>
        <div className={styles.titleRow}>
          {!isLargeThenMobile && <Avatar image={{ src: props.avatarUrl }} size={24} />}
          <Caption1 className={styles.userName}>{props.userName}</Caption1>
          <div className={styles.actionRow}>
            <Button
              icon={isStarred ? <Star20Filled /> : <Star20Regular />}
              appearance="transparent"
              onClick={onStar}
            />
            <Button
              icon={isRead ? <CheckmarkCircle20Filled /> : <Circle20Regular />}
              appearance="transparent"
              onClick={onRead}
            />
          </div>
        </div>
        <Text>{props.content}</Text>
        {props.coverImageUrl && (
          <Image
            src={props.coverImageUrl}
            alt=""
            width={120}
            height={80}
            loading="lazy"
            className={styles.coverImage}
          />
        )}
      </div>
    </div>
  );
};
