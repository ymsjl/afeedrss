import { makeStyles, tokens } from '@fluentui/react-components';

export const useClasses = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    paddingInline: tokens.spacingVerticalS,
    paddingBlock: tokens.spacingVerticalMNudge,
  },
  sticky: {
    position: "sticky",
    top: 0,
    backgroundColor: tokens.colorNeutralBackground3,
    zIndex: tokens.zIndexContent,
  },
  divider: {
    flexGrow: 0,
    marginInline: tokens.spacingHorizontalXS,
  }
});
