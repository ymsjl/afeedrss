import { makeStyles, tokens } from "@fluentui/react-components";

export const useClasses = makeStyles({
  nav: {
    flexShrink: 0,
    backgroundColor: tokens.colorNeutralBackground4,
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
