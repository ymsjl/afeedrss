import { makeStyles, tokens, shorthands } from "@fluentui/react-components";
import { appTokens } from "@/theme/tokens";

export const useListClasses = makeStyles({
  list: {
    [appTokens.breakpoints.medium]: {
      marginBlockStart: tokens.spacingVerticalXS,

      "> li": {
        marginInline: tokens.spacingVerticalXS,
      },

      "> li:not(:last-child)": {
        marginBlockEnd: tokens.spacingVerticalS,
      },
    },
  },
  listItem: {
    transition: "all",
    ...shorthands.padding(tokens.spacingHorizontalM, tokens.spacingVerticalL),
    backgroundColor: tokens.colorNeutralBackground1,
    [appTokens.breakpoints.medium]: {
      ...shorthands.borderRadius(tokens.borderRadiusMedium),
      boxShadow: tokens.shadow2,

      "&:hover": {
        backgroundColor: tokens.colorBrandBackground2Hover,
        boxShadow: tokens.shadow4,
      }
    },
  },
});

export const useClasses = makeStyles({
  thumbnail: {
    width: "80px",
    height: "60px",
    borderRadius: tokens.borderRadiusMedium,
    objectFit: "cover",
  },
  thumbnailBackground: {
    backgroundColor: tokens.colorNeutralBackground1,
  },
  swipeoutContainer: {},
  leftButton: {
    backgroundColor: tokens.colorBrandBackground,
    color: "white",
    fontWeight: "500",
  },
  swipeoutButtonStar: {
    backgroundColor: tokens.colorPaletteYellowBackground3,
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
    [appTokens.breakpoints.medium]: {
      outline: `1px solid ${tokens.colorBrandForeground1}`,
    }
  },
  withThumbnail: {},
  withoutThumbnail: {
    alignItems: "center",
  },
  thumbnailWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "80px",
    height: "60px",
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground3,
  },
  imageOff: {
    color: tokens.colorNeutralForegroundDisabled,
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
    color: tokens.colorNeutralForeground4,
  },
  readButton: {
    display: "none",
    flexShrink: 0,
    [appTokens.breakpoints.medium]: {
      display: "block",
    },
  },
});
