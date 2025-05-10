import { appTokens } from "@/theme/tokens";
import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useClasses = makeStyles({
  nav: {
    flexShrink: 0,
    backgroundColor: tokens.colorNeutralBackground4,
    [appTokens.maxBreakpoints.small]: {
      width: '100%',
      ...shorthands.borderRadius(tokens.borderRadiusXLarge, tokens.borderRadiusXLarge, 0, 0),
    }
  },
  navItem: {
    display: "flex",
    width: "100%",
    alignItems: "center",
  },
});
