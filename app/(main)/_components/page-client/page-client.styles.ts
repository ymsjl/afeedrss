import { appTokens } from "@/theme/tokens";
import { makeStyles, tokens, shorthands } from "@fluentui/react-components";

export const useClasses = makeStyles({
  root: {
    [appTokens.breakpoints.medium]: {
      gap: tokens.spacingHorizontalM,
    }
  },
  mainLayout: {
    overflow: 'hidden',
    gap: tokens.spacingHorizontalM,
    [appTokens.breakpoints.medium]: {
      paddingInline: tokens.spacingHorizontalM,
    },
  },
  mainSurface: {
    backgroundColor: tokens.colorNeutralBackground1,
    [appTokens.breakpoints.medium]: {
      backgroundColor: tokens.colorNeutralBackground3,
      border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
      ...shorthands.borderRadius(
        tokens.borderRadiusXLarge,
        0,
        0,
        0
      ),
    },
  },
  pageTitle: {
    marginBlock: tokens.spacingVerticalXS,
  },
  pageTitleCenter: {
    marginInline: "auto",
    [appTokens.breakpoints.medium]: {
      maxWidth: "65rem",
      width: "100%",
    },
  },
  content:{
    overflowX: "hidden",
    [appTokens.breakpoints.medium]: {
      maxWidth: "65rem",
    },
  },
  fullHeightColumnLayout: {
    height: "100%",
    width: "100%",
    marginInline: "auto",
  },
  columnNoShrink: {
    flexShrink: 0,
    marginInline: 0,
    [appTokens.breakpoints.medium]: {
      maxWidth: "32rem",
    },
  },
  columnGrow: {
    marginInline: 0,
    maxWidth: "unset",
  },
});
