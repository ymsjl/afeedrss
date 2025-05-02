import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useClasses = makeStyles({
  root: {
    position: "fixed",
    zIndex: tokens.zIndexOverlay,
    bottom: 0,
    left: 0,
    right: 0,
    height: '48px',
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    paddingBlock: tokens.spacingVerticalS,
    paddingInline: tokens.spacingHorizontalM,
  },
  titleContainer:{
    flex: 1,
  },
  title: {
    borderRadius: tokens.borderRadiusMedium,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    width: '100%',
  },
  highlight: {
    color: tokens.colorPaletteYellowForeground3,
  }
})