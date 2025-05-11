import { makeStyles, tokens } from "@fluentui/react-components";
export const useClasses = makeStyles({
  root: {
    position: "fixed",
    zIndex: tokens.zIndexOverlay,
    bottom: 0,
    left: 0,
    right: 0,
    height: '56px',
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    paddingBlock: tokens.spacingVerticalS,
    paddingInline: tokens.spacingHorizontalM,
    borderTop: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
  title: {
    borderRadius: tokens.borderRadiusMedium,
    width: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
})