import { makeStyles, tokens } from '@fluentui/react-components';

export const useClasses = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    paddingInline: tokens.spacingVerticalXS,
    paddingBlock: tokens.spacingVerticalS,
  },
  sticky: {
    position: "sticky",
    top: 0,
    backgroundColor: tokens.colorNeutralBackground3,
    zIndex: tokens.zIndexContent,
  }
});
