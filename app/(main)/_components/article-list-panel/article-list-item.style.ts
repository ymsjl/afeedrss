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
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    ...shorthands.gap(tokens.spacingHorizontalM),
    listStyle: 'none',
    marginInline: tokens.strokeWidthThick,
    ...shorthands.padding(0),
    [appTokens.breakpoints.medium]: {
      marginBlockStart: tokens.spacingVerticalXS,
      "> li": {
        marginInline: 0,
        marginBlockEnd: 0,
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

export const useTwitterLikeItemStyles = makeStyles({
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

export const useGridItemClasses = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    gap: tokens.spacingVerticalS,
    cursor: "pointer",
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow2,
    "&:hover": {
      backgroundColor: tokens.colorBrandBackground2Hover,
      boxShadow: tokens.shadow4,
    },
    ...shorthands.overflow("hidden"),
  },
  isRead: {
    opacity: 0.7,
  },
  isSelected: {
    outline: `2px solid ${tokens.colorBrandStroke1}`,
    boxShadow: tokens.shadow8,
  },
  coverImageWrapper: {
    position: "relative",
    width: "100%",
    height: "200  px", // Adjust height as needed
    [appTokens.breakpoints.medium]: {
      height: '200px',
    }
  },
  coverImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  textContentFloat: {
    position: "absolute",
    zIndex: tokens.zIndexContent,
    left: tokens.spacingHorizontalS,
    right: tokens.spacingHorizontalS,
    bottom: tokens.spacingVerticalXS,
    borderRadius: tokens.borderRadiusLarge,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorBrandStroke2}`,
    backdropFilter: "blur(40px)",
    backgroundColor: tokens.colorNeutralBackgroundAlpha2,
    paddingBlockStart: tokens.spacingVerticalS,
  },
  textContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    ...shorthands.padding(tokens.spacingVerticalXXS, tokens.spacingHorizontalM, tokens.spacingVerticalM),
  },
  titleRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: tokens.spacingVerticalS,
  },
  title: {
    flexGrow: 1,
    display: "-webkit-box",
    "-webkit-line-clamp": "2",
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    minHeight: `calc(${tokens.lineHeightBase300} * 2)`,
  },
  metaInfo: {
    display: "flex",
    gap: tokens.spacingVerticalXS,
    color: tokens.colorNeutralForeground4,
  },
  sourceInfo: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  dateInfo: {
  },
  userName: {
    flex: 1
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: tokens.spacingHorizontalS,
  },
  highlight: {
    color: tokens.colorPaletteYellowForeground3,
  }
});

