'use client'

import React from "react";
import {
  Button,
  Image,
  mergeClasses,
  Caption1,
  Body1Strong,
  tokens
} from "@fluentui/react-components";
import { Circle20Regular, CheckmarkCircle20Filled, Star20Regular, Star20Filled, ImageOff20Regular, } from "@fluentui/react-icons";
import Swipeout from "@components/swipe-out";
import { filterImgSrcfromHtmlStr } from "@utils/filterImgSrcfromHtmlStr";
import dayjs from "@utils/dayjs";
import { useClasses, useListClasses } from "./stream-content-list-item.style";
import { StreamContentItemWithPageIndex } from "@/features/stream-content/use-stream-contents-query";
import { useFlexClasses } from "@/theme/commonStyles";
import { Avatar, Text } from "@fluentui/react-components";
import { makeStyles } from "@fluentui/react-components";
import { useLargeThenMobile } from "@/utils/use-large-then-mobile";
import { appTokens } from "@/theme/tokens";
import { useAppStore } from "@/app/providers/app-store-provider";

interface StreamContentListItemProps {
  item: StreamContentItemWithPageIndex;
  isSelected: boolean;
  showFeedThumbnail: boolean;
  onMarkAsRead: (item: StreamContentItemWithPageIndex) => void;
  onMarkAsStar: (item: StreamContentItemWithPageIndex) => void;
  onMarkAboveAsRead: (
    item: StreamContentItemWithPageIndex,
    isRead: boolean
  ) => void;
  onSelectArticle: (item: StreamContentItemWithPageIndex) => void;
}

const StreamContentListItem: React.FC<StreamContentListItemProps> = ({
  item,
  isSelected,
  showFeedThumbnail,
  onMarkAsRead,
  onMarkAsStar,
  onMarkAboveAsRead,
  onSelectArticle,
}) => {
  const { title } = item;
  const classes = useClasses();
  const flexClasses = useFlexClasses();
  const listItemClasses = useListClasses();
  const layoutType = useAppStore(state => state.layoutType);

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

  const src = filterImgSrcfromHtmlStr(item.summary.content);

  if (layoutType === 'pictureOnBottom') {
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

  const renderContent = () => {
    const containerClassName = mergeClasses(
      classes.articleContainer,
      !isSelected && item?.isRead && classes.readArticle,
      showFeedThumbnail ? classes.withThumbnail : classes.withoutThumbnail
    );
    
    if (layoutType === 'textOnly') {
      return (
        <div
          className={containerClassName}
          onClick={() => onSelectArticle(item)}
        >
          <Body1Strong
            className={mergeClasses(classes.title, flexClasses.flexGrow)}
            block
            truncate
            wrap={false}
          >
            {title}
          </Body1Strong>
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
            <Body1Strong className={classes.title} block>
              {title}
            </Body1Strong>
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

export default StreamContentListItem;

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

const useTwitterLikeItemStyles = makeStyles({
  root: {
    display: "flex",
    gap: tokens.spacingVerticalM,
    cursor: "pointer",
  },
  sourceRow: {
    display: "flex",
  },
  contentColum: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    paddingBlockEnd: tokens.spacingVerticalM,
  },
  coverImage: {
    borderRadius: tokens.borderRadiusLarge,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    objectFit: "cover",
    maxWidth: "400px",
    width: "100%",
    height: '200px',
    [appTokens.breakpoints.medium]: {
      height: '250px',
    }
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingVerticalS,
  },
  userName: {
    flex: 1
  },
  actionRow: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
  },
  highlight: {
    color: tokens.colorPaletteYellowForeground3,
  }
});

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
