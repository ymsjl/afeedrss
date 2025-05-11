import { appTokens } from "@/theme/tokens";
import { makeStyles, tokens, shorthands } from "@fluentui/react-components";

export const useSharedPageLayoutClasses = makeStyles({
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
    display: "flex",
    alignItems: "center",
    marginBlock: tokens.spacingVerticalXS,
  },
  pageTitleCenter: {
    marginInline: "auto",
    [appTokens.breakpoints.medium]: {
      maxWidth: "65rem",
      width: "100%",
    },
  },
  content: {
    overflowX: "hidden",
    [appTokens.breakpoints.medium]: {
      maxWidth: "65rem",
      marginInline: "auto",
    },
  },
  maxWidthUnset: {
    [appTokens.breakpoints.medium]: {
      maxWidth: "unset",
    }
  },
  fullHeightColumnLayout: {
    height: "100%",
    width: "100%",
  },
});
