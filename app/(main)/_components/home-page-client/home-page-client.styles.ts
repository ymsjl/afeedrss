import { appTokens } from "@/theme/tokens";
import { makeStyles, tokens, shorthands } from "@fluentui/react-components";

export const useClasses = makeStyles({
  root: {
    display: "flex",
    height: "100%",
    flex: 1,
    [appTokens.breakpoints.medium]: {
      gap: tokens.spacingHorizontalM,
    }
  },
  body: {
    position: "relative",
    overflow: "hidden",
    height: "100%",
  },
  title: {
    flexGrow: 1,
    flexShrink: 0,
  },
  streamContentPanel: {
    overflowY: "scroll",
    height: "100%",
    transition: "all 0.3s ease-in-out",
  },
  streamContentPanelOpened: {
    transform: "translateX(0)",
    opacity: 1,
  },
  streamContentPanelClosed: {
    transform: "translateX(-100%)",
    opacity: 0,
  },
  articelPanel: {
    position: "absolute",
    ...shorthands.inset("0"),
    zIndex: tokens.zIndexOverlay,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    maxWidth: '100%',
    marginBlockStart: tokens.spacingHorizontalXS,
    backgroundColor: tokens.colorNeutralBackground1,
    [appTokens.breakpoints.medium]: {
      marginInline: tokens.spacingHorizontalXS,
      boxShadow: tokens.shadow2,
      ...shorthands.borderRadius(
        tokens.borderRadiusLarge,
        tokens.borderRadiusLarge,
        0,
        0
      ),
    },
    transition: "all 0.3s ease-in-out",
  },
  articelPanelOpened: {
    transform: "translateX(0px)",
  },
  articelPanelClosed: {
    transform: "translateX(calc(100% + 16px))",
  },
  hamburger: {
    display: "block",
    paddingBlock: tokens.spacingVerticalS,
  },
  hamburgerHiden: {
    [appTokens.breakpoints.medium]: {
      display: "none",
    },
  },
  headerTextBlock: {
    paddingBlock: tokens.spacingVerticalS,
    lineHeight: tokens.lineHeightBase300,
  },
  articelPanelHeader: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    [appTokens.breakpoints.medium]: {
      ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalL),
    },
  },
});
