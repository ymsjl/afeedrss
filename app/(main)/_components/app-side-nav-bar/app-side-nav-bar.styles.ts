import { makeStyles, tokens } from "@fluentui/react-components";

export const useClasses = makeStyles({
  root: {},
  header: {
    paddingLeft: tokens.spacingHorizontalXL,
    paddingRight: tokens.spacingVerticalMNudge,
    paddingBlock: tokens.spacingVerticalM,
  },
  hamburger: {
    maxWidth: '100%',
  },
  invisible: {
    visibility: "hidden",
  },
  nav: {
    flexShrink: 0,
    maxWidth: '80px',
    zIndex: tokens.zIndexFloating,
  },
  navItem: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: tokens.spacingVerticalXS,
    fontSize: tokens.fontSizeBase200,
    alignItems: "center",
    "::after": {
      left: "0",
      top: "0",
      bottom: "0",
      marginInlineStart: "0",
      marginBlock: "auto",
      height: "32px",
    }
  },
  navItemIcon: {
    fontSize: tokens.fontSizeBase600,
  }
});
