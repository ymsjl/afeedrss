import { appTokens } from "@/theme/tokens";
import { makeStyles, tokens, shorthands } from "@fluentui/react-components";

export const useClasses = makeStyles({
  root: {
  },
  columnNoShrink: {
    flexShrink: 0,
    marginInline: 0,
    [appTokens.breakpoints.medium]: {
      maxWidth: "30rem",
    },
  },
  columnGrow: {
    marginInline: 0,
    maxWidth: "unset",
  },
});
