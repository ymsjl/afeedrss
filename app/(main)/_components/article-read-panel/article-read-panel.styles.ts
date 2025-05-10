import { appTokens } from "@/theme/tokens";
import { makeStyles, tokens, shorthands } from "@fluentui/react-components";

export const useClasses = makeStyles({
  title: {
    display: "block",
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    cursor: "pointer",
  },
  articleLayout: {
    marginInline: 'auto',
    marginBlockStart: tokens.spacingVerticalXXXL,
  },
  caption: {
    color: tokens.colorNeutralForeground3,
  },
  divider: {
    paddingBlockStart: tokens.spacingVerticalXXXL,
    paddingBlockEnd: '80px',
    marginInline: tokens.spacingHorizontalL,
    width: 'auto'
  },
  articelPanelLayout: {
    maxWidth: '100%',
    paddingInline: tokens.spacingHorizontalL,
  },
  articelPanelSurface: {
    backgroundColor: tokens.colorNeutralBackground1,
    [appTokens.breakpoints.medium]: {
      marginBlockStart: tokens.spacingVerticalXS,
      marginInline: tokens.spacingVerticalXS,
      boxShadow: tokens.shadow2,
      ...shorthands.borderRadius(
        tokens.borderRadiusLarge,
        tokens.borderRadiusLarge,
        0,
        0
      ),
    },
  },
});
