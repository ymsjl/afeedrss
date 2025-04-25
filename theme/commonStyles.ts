import { makeStyles, tokens, shorthands } from "@fluentui/react-components";

export const useFlexClasses = makeStyles({
  // 弹性布局工具类
  flexRow: {
    display: "flex",
    flexDirection: "row",
  },
  flexCol: {
    display: "flex",
    flexDirection: "column",
  },
  flexCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  flexBetween: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  flexWrap: {
    display: "flex",
    flexWrap: 'wrap'
  },
  flexGrow: {
    flexGrow: 1,
  },
  flexShrink: {
    flexShrink: 1,
  },
  flexDisableShrink: {
    flexShrink: 0,
  },
  itemsCenter: {
    alignItems: "center",
  },
  itemsStart: {
    alignItems: "flex-start",
  },
  itemsEnd: {
    alignItems: "flex-end",
  },
  justifyStart: {
    justifyContent: "flex-start",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  justifyEnd: {
    justifyContent: "flex-end",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },
})

export const useTextClasses = makeStyles({
  // 文本工具类
  truncate: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  truncate2: {
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
  },

  textXs: { fontSize: tokens.fontSizeBase200 },
  textSm: { fontSize: tokens.fontSizeBase300 },
  textBase: { fontSize: tokens.fontSizeBase400 },
  textLg: { fontSize: tokens.fontSizeBase500 },
  textXl: { fontSize: tokens.fontSizeBase600 },
  text2xl: { fontSize: tokens.fontSizeHero700 },
  fontBold: { fontWeight: tokens.fontWeightBold },
  fontSemibold: { fontWeight: tokens.fontWeightSemibold },
  fontNormal: { fontWeight: tokens.fontWeightRegular },
  textCenter: { textAlign: "center" },
  textLeft: { textAlign: "left" },
  textRight: { textAlign: "right" },
  underline: { textDecorationLine: "underline" },
  lineThrough: { textDecorationLine: "line-through" },

  // 语义化文本样式
  textPrimary: { color: tokens.colorNeutralForeground1 },
  textSecondary: { color: tokens.colorNeutralForeground2 },
  textTertiary: { color: tokens.colorNeutralForeground3 },
  textQuaternary: { color: tokens.colorNeutralForeground4 },
  textDisabled: { color: tokens.colorNeutralForegroundDisabled },
  textBrand: { color: tokens.colorBrandForeground1 },
  textSuccess: { color: tokens.colorStatusSuccessForeground1 },
  textWarning: { color: tokens.colorStatusWarningForeground1 },
  textError: { color: tokens.colorStatusDangerForeground1 },

  // 语言特定样式
  textChinese: {
    fontFamily: tokens.fontFamilyBase,
    lineHeight: tokens.lineHeightBase400,
    letterSpacing: "0.05em",
  },
  textEnglish: {
    fontFamily: tokens.fontFamilyBase,
    lineHeight: tokens.lineHeightBase300,
    letterSpacing: "0.01em",
  },
  textCode: {
    fontFamily: "Monaco, Consolas, monospace",
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
  },
});

export const useCommonClasses = makeStyles({
  // 间距和大小工具类
  m1: { ...shorthands.margin(tokens.spacingHorizontalXS) },
  m2: { ...shorthands.margin(tokens.spacingHorizontalS) },
  m4: { ...shorthands.margin(tokens.spacingHorizontalM) },
  mt1: { marginTop: tokens.spacingVerticalXS },
  mt2: { marginTop: tokens.spacingVerticalS },
  mt4: { marginTop: tokens.spacingVerticalM },
  mt5: { marginTop: tokens.spacingVerticalL },
  mt6: { marginTop: tokens.spacingVerticalXL },
  mt7: { marginTop: tokens.spacingVerticalXXL },
  mt8: { marginTop: tokens.spacingVerticalXXXL },

  mb1: { marginBottom: tokens.spacingVerticalXS },
  mb2: { marginBottom: tokens.spacingVerticalS },
  mb4: { marginBottom: tokens.spacingVerticalM },
  mx1: { ...shorthands.margin(0, tokens.spacingHorizontalXS) },
  mx2: { ...shorthands.margin(0, tokens.spacingHorizontalS) },
  mx4: { ...shorthands.margin(0, tokens.spacingHorizontalM) },
  mxAuto: { marginInline: "auto" },
  my1: { ...shorthands.margin(tokens.spacingVerticalXS, 0) },
  my2: { ...shorthands.margin(tokens.spacingVerticalS, 0) },
  my4: { ...shorthands.margin(tokens.spacingVerticalM, 0) },

  p1: { ...shorthands.padding(tokens.spacingHorizontalXS) },
  p2: { ...shorthands.padding(tokens.spacingHorizontalS) },
  p4: { ...shorthands.padding(tokens.spacingHorizontalM) },
  px1: { ...shorthands.padding(0, tokens.spacingHorizontalXS) },
  px2: { ...shorthands.padding(0, tokens.spacingHorizontalS) },
  px4: { ...shorthands.padding(0, tokens.spacingHorizontalM) },
  py1: { ...shorthands.padding(tokens.spacingVerticalXS, 0) },
  py2: { ...shorthands.padding(tokens.spacingVerticalS, 0) },
  py4: { ...shorthands.padding(tokens.spacingVerticalM, 0) },

  spaceX1: { "> * + *": { marginLeft: tokens.spacingHorizontalXS } },
  spaceX2: { "> * + *": { marginLeft: tokens.spacingHorizontalS } },
  spaceX4: { "> * + *": { marginLeft: tokens.spacingHorizontalM } },
  spaceX6: { "> * + *": { marginLeft: tokens.spacingHorizontalL } },
  spaceX8: { "> * + *": { marginLeft: tokens.spacingHorizontalXL } },
  spaceX10: { "> * + *": { marginLeft: tokens.spacingHorizontalXXL } },
  spaceX12: { "> * + *": { marginLeft: tokens.spacingHorizontalXXXL } },

  spaceY1: { "> * + *": { marginTop: tokens.spacingVerticalXS } },
  spaceY2: { "> * + *": { marginTop: tokens.spacingVerticalS } },
  spaceY4: { "> * + *": { marginTop: tokens.spacingVerticalM } },
  spaceY6: { "> * + *": { marginTop: tokens.spacingVerticalL } },
  spaceY8: { "> * + *": { marginTop: tokens.spacingVerticalXL } },
  spaceY10: { "> * + *": { marginTop: tokens.spacingVerticalXXL } },
  spaceY12: { "> * + *": { marginTop: tokens.spacingVerticalXXXL } },


  // 宽度和高度
  w25: { width: "25%" },
  w50: { width: "50%" },
  w75: { width: "75%" },
  w100: { width: "100%" },
  wScreen: { width: "100vw" },
  h25: { height: "25%" },
  h50: { height: "50%" },
  h75: { height: "75%" },
  h100: { height: "100%" },
  hScreen: { height: "100vh" },

  block: {
    display: "block",
  },

  // 定位工具类
  absoluteFill: {
    position: "absolute",
    ...shorthands.inset(0),
  },
  relative: {
    position: "relative",
  },
  absolute: {
    position: "absolute",
  },
  sticky: {
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  fixed: {
    position: "fixed",
    ...shorthands.inset(0),
  },



  // 边框和圆角
  roundedSm: { ...shorthands.borderRadius(tokens.borderRadiusSmall) },
  roundedMd: { ...shorthands.borderRadius(tokens.borderRadiusMedium) },
  roundedLg: { ...shorthands.borderRadius(tokens.borderRadiusLarge) },
  roundedFull: { ...shorthands.borderRadius("9999px") },
  border: { ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1) },
  borderT: { borderTop: `1px solid ${tokens.colorNeutralStroke1}` },
  borderB: { borderBottom: `1px solid ${tokens.colorNeutralStroke1}` },

  // 过渡动画
  transition: {
    transitionProperty: "all",
    transitionDuration: "200ms",
    transitionTimingFunction: "ease-in-out",
  },
  transitionFast: {
    transitionProperty: "all",
    transitionDuration: "100ms",
    transitionTimingFunction: "ease-in-out",
  },
  transitionSlow: {
    transitionProperty: "all",
    transitionDuration: "300ms",
    transitionTimingFunction: "ease-in-out",
  },

  // 滚动容器
  scrollY: {
    overflowY: "auto",
    overflowX: "hidden",
    WebkitOverflowScrolling: "touch",
  },
  scrollX: {
    overflowX: "auto",
    overflowY: "hidden",
    WebkitOverflowScrolling: "touch",
  },
  noScrollbar: {
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },

  // 响应式工具类
  hiddenSm: {
    "@media (max-width: 640px)": {
      display: "none",
    },
  },
  hiddenMd: {
    "@media (max-width: 768px)": {
      display: "none",
    },
  },
  hiddenLg: {
    "@media (max-width: 1024px)": {
      display: "none",
    },
  },

  // 卡片和容器样式
  card: {
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(tokens.spacingHorizontalM),
  },
  cardHover: {
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(tokens.spacingHorizontalM),
    transitionProperty: "all",
    transitionDuration: "200ms",
    ":hover": {
      boxShadow: tokens.shadow8,
      transform: "translateY(-2px)",
    }
  },
  glass: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },

  // 鼠标样式
  pointerEvents: {
    pointerEvents: "none",
  },
  cursorPointer: {
    cursor: "pointer",
  },
  cursorNotAllowed: {
    cursor: "not-allowed",
  },
});