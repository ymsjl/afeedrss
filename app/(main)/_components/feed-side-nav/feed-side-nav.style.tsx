import { appTokens } from "@/theme/tokens";
import { makeStyles, tokens } from "@fluentui/react-components";

export const useClasses = makeStyles({
  nav: {
    flexShrink: 0,
    backgroundColor: tokens.colorNeutralBackground4,
    [appTokens.maxBreakpoints.small]:{
      width: '100%',
    }
  },
  navItem: {
    display: "flex",
    width: "100%",
    alignItems: "center",
  },
  skeleton: {
    marginBlockEnd: tokens.spacingVerticalXXS
  },
  skeletonItem: {
    height: '40px',
  }
});
