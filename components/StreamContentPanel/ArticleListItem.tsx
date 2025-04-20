import React from "react";
import {
  Button,
  Text,
  Image,
  makeStyles,
  mergeClasses,
  shorthands,
  Skeleton,
  SkeletonItem,
} from "@fluentui/react-components";
import { Circle20Regular, CheckmarkCircle20Filled, Circle20Filled } from "@fluentui/react-icons";
import { StreamContentItem } from "@/server/inoreader/stream.types";
import Swipeout from "../Swipeout";
import { filterImgSrcfromHtmlStr } from "@/utils/filterImgSrcfromHtmlStr";
import dayjs from "@/utils/dayjs";
import { tokens } from "@fluentui/react-components";
import { useFlexClasses } from "@/theme/commonStyles";
import { useCommonClasses } from './../../theme/commonStyles';

interface StreamContentItemWithPageIndex extends StreamContentItem {
  pageIndex: number;
}

interface ArticleListItemProps {
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

const ArticleListItem: React.FC<ArticleListItemProps> = ({
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
        data-is-focusable={true}
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
                  fit="cover"
                  className={classes.thumbnail}
                  alt=""
                />
              )}
            </div>
            <div className={classes.contentWrapper}>
              <div className={classes.titleWrapper}>
                <Text className={classes.title} block>
                  {title}
                </Text>
              </div>
              <div className={classes.metaInfo}>
                <Text className={classes.sourceInfo}>
                  {`${item.origin.title}/ ${dayjs(
                    item?.published * 1000
                  ).fromNow()}`}
                </Text>
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
            <Text
              className={mergeClasses(classes.title, "flex-1")}
              block
              wrap={false}
            >
              {title}
            </Text>
            <Text className={classes.sourceInfo} block wrap={false}>
              {`${item.origin.title}/ ${dayjs(
                item?.published * 1000
              ).fromNow()}`}
            </Text>
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

export default ArticleListItem;

export const useListClasses = makeStyles({
  list: {
    marginBlockStart: tokens.spacingVerticalXS,

    "> li": {
      marginInline: tokens.spacingVerticalXS,
    },

    "> li:not(:last-child)": {
      marginBlockEnd: tokens.spacingVerticalS,
    },
  },
  listItem: {
    transition: "all",
    boxShadow: tokens.shadow2,
    ...shorthands.padding(tokens.spacingHorizontalM, tokens.spacingVerticalL),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground1,
    "&:hover": {
      boxShadow: tokens.shadow4,

      backgroundColor: tokens.colorBrandBackgroundInvertedHover,
    },
  },
});

export function ArticleListItemSkeleton() {
  const classes = useClasses()
  const flexClasses = useFlexClasses()
  const commonClasses = useCommonClasses();
  return (
    <Skeleton>
      <div className={mergeClasses(flexClasses.flexRow, commonClasses.spaceX4)}>
        <SkeletonItem className={mergeClasses(classes.thumbnailSkeleton, flexClasses.flexDisableShrink)} />
        <div className={mergeClasses(flexClasses.flexGrow, commonClasses.spaceY2)}>
          <SkeletonItem className={classes.titleSkeleton} />
          <SkeletonItem className={classes.titleSkeleton} />
        </div>
      </div>
    </Skeleton>
  )
}

const useClasses = makeStyles({
  thumbnail: {
    width: "80px",
    height: "80px",
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  thumbnailSkeleton: {
    width: "80px",
    height: "80px",
    borderRadius: tokens.borderRadiusLarge,
  },
  titleSkeleton: {

  },
  swipeoutContainer: {},
  leftButton: {
    backgroundColor: tokens.colorBrandBackground,
    color: "white",
    fontWeight: "500",
  },
  leftButtonAbove: {
    backgroundColor: tokens.colorBrandBackground3Static,
    color: "white",
    fontWeight: "500",
  },
  articleContainer: {
    display: "flex",
    gap: "1rem",
    cursor: "pointer",
    wordBreak: "break-all",
  },
  readArticle: {
    opacity: 0.3,
  },
  selectedItem: {
    outline: `1px solid ${tokens.colorBrandForeground1}`,
  },
  withThumbnail: {
  },
  withoutThumbnail: {
    alignItems: "center",
  },
  thumbnailWrapper: {
    flexShrink: 0,
  },
  contentWrapper: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  titleWrapper: {
    flexGrow: 1,
  },
  title: {
    cursor: "pointer",
  },
  metaInfo: {
    display: "flex",
    alignItems: "center",
  },
  sourceInfo: {
    fontSize: "0.75rem",
    color: tokens.colorNeutralForeground3,
    flexGrow: 1,
  },
  readButton: {
    display: "none",
    flexShrink: 0,
    "@media(min-width: 640px)": {
      display: "block",
    },
  },
});
