import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useHalfScreenModalStyles = makeStyles({
  overlay: {
    position: "fixed",
    ...shorthands.inset(0),
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    touchAction: "none",
  },

  modal: {
    ...shorthands.borderRadius(tokens.borderRadiusLarge, tokens.borderRadiusLarge, 0, 0),
    backgroundColor: tokens.colorNeutralBackground1,
    width: "100%",
    paddingInline: tokens.spacingVerticalM,
    paddingBlockEnd: '48px',
    boxShadow: tokens.shadow16,
    position: "relative",
    overflow: "hidden",
    touchAction: "none",
  },

  handle: {
    width: "40px",
    height: "4px",
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    backgroundColor: tokens.colorNeutralBackground3,
    marginInline: "auto",
    marginBlockStart: tokens.spacingVerticalS,
    marginBlockEnd: tokens.spacingVerticalM,
  },

  small: {
    height: "30vh",
  },

  medium: {
    height: "50vh",
  },

  large: {
    height: "70vh",
  },

  hidden: {
    display: "none",
  },

  content: {
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
  }
});