import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useHalfScreenModalStyles = makeStyles({
  overlay: {
    position: "fixed",
    ...shorthands.inset(0),
    zIndex: tokens.zIndexPopup,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    overflow: "hidden",
    touchAction: "none",
    '::-webkit-scrollbar': {
      height: '0px',
      width: '0px',
    }
  },

  mask: {
    position: "absolute",
    ...shorthands.inset(0),
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    touchAction: "none",
    willChange: 'opacity'
  },

  modal: {
    position: "relative",
    overflow: "hidden",
    ...shorthands.borderRadius(tokens.borderRadiusXLarge, tokens.borderRadiusXLarge, 0, 0),
    width: "100%",
    paddingInline: tokens.spacingVerticalM,
    paddingBlockEnd: tokens.spacingVerticalM,
    display: "flex",
    flexDirection: "column",
    touchAction: "none",
    backgroundColor: tokens.colorNeutralBackground2,
    boxShadow: tokens.shadow16,
  },

  handle: {
    flexShrink: 0,
    marginInline: "auto",
    marginBlockStart: tokens.spacingVerticalS,
    marginBlockEnd: tokens.spacingVerticalXXL,
    width: "80px",
    height: "4px",
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    backgroundColor: tokens.colorNeutralForeground4,
    opacity: '0.5',
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
    flex: '1',
    overflow: 'hidden',
  }
});