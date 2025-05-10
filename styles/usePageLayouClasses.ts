import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { appTokens } from "@/theme/tokens";
import { flexColumnFullHeight } from "@/theme/commonStyles";

export const usePageLayoutClasses = makeStyles({
  main: {
    flex: 1,
    overflow: 'hidden',

    display: 'flex',
    gap: tokens.spacingHorizontalM,

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
      paddingInlineStart: tokens.spacingHorizontalM,
    },
  },
  content: {
    ...flexColumnFullHeight,
    marginInline: "auto",
    width: "100%",
    [appTokens.breakpoints.medium]: {
      paddingInlineEnd: tokens.spacingHorizontalL,
    },
    [appTokens.breakpoints.xxxl]: {
      maxWidth: "64rem",
    }
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    background: "inherit",
    gap: tokens.spacingHorizontalS,
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalXS, tokens.spacingVerticalM),
  },
})