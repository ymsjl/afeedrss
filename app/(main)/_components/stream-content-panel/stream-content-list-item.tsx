'use client'

import React from "react";
import {
  Button,
  Image,
  mergeClasses,
  Caption1,
  Body1Strong
} from "@fluentui/react-components";
import { Circle20Regular, CheckmarkCircle20Filled } from "@fluentui/react-icons";
import { StreamContentItem } from "@/server/inoreader/stream.types";
import Swipeout from "@components/swipe-out";
import { filterImgSrcfromHtmlStr } from "@/utils/filterImgSrcfromHtmlStr";
import dayjs from "@/utils/dayjs";
import { useClasses, useListClasses } from "./stream-content-list-item.style";
import { useMediaQuery } from '@reactuses/core';
import { breakpointQuerys } from "@/theme/tokens";
import { useAppStore } from "@/app/providers/app-store-provider";

interface StreamContentItemWithPageIndex extends StreamContentItem {
  pageIndex: number;
}

interface StreamContentListItemProps {
  item: StreamContentItemWithPageIndex;
  isSelected: boolean;
  showFeedThumbnail: boolean;
  onMarkAsRead: (item: StreamContentItemWithPageIndex) => void;
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
  onMarkAboveAsRead,
  onSelectArticle,
}) => {
  const { title } = item;
  const classes = useClasses();
  const listItemClasses = useListClasses();
  const isMobileSSR = useAppStore(store=> store.isMobileSSR);
  const isWide = useMediaQuery(breakpointQuerys.medium, !isMobileSSR);

  const onRead: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onMarkAsRead(item);
  };

  const onReadAbove: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    onMarkAboveAsRead(item, true);
  };

  const src = filterImgSrcfromHtmlStr(item.summary.content);

  return (
    <Swipeout
      className={mergeClasses(listItemClasses.listItem, classes.swipeoutContainer, isSelected && classes.selectedItem,)}
      rightBtnsProps={[
        {
          className: classes.leftButton,
          text: "已读",
          onClick: onRead,
        },
        {
          className: classes.leftButtonAbove,
          text: "上方已读",
          onClick: onReadAbove,
        },
      ]}
      overswipeRatio={0.3}
      btnWidth={96}
    >
      <div
        className={mergeClasses(
          classes.articleContainer,
          !isSelected && item?.isRead && classes.readArticle,
          showFeedThumbnail ? classes.withThumbnail : classes.withoutThumbnail
        )}
        onClick={() => onSelectArticle(item)}
      >
        {showFeedThumbnail ? (
          <>
            <div className={classes.thumbnailWrapper}>
              {src && (
                <Image
                  src={src}
                  className={mergeClasses(classes.thumbnail, classes.thumbnailBackground)}
                  alt=""
                />
              )}
            </div>
            <div className={classes.contentWrapper}>
              <div className={classes.titleWrapper}>
                <Body1Strong className={classes.title} block>
                  {title}
                </Body1Strong>
              </div>
              <div className={classes.metaInfo}>
                <Caption1 className={classes.sourceInfo}>
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
          </>
        ) : (
          <>
            <Body1Strong
              className={mergeClasses(classes.title)}
              block
              wrap={false}
            >
              {title}
            </Body1Strong>
            <Caption1 className={classes.sourceInfo} block wrap={false}>
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
          </>
        )}
      </div>
    </Swipeout>
  );
};

export default StreamContentListItem;


