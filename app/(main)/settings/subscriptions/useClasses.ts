import { makeStyles, tokens } from "@fluentui/react-components";

export const useClasses = makeStyles({
  formItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    ":not(:last-child)": {
      marginBottom: "16px",
    },
  },
  feedItemContainer: {
    gap: tokens.spacingHorizontalM,
  },
  icon: {
    borderRadius: tokens.borderRadiusCircular
  },
  fullWidth: {
    width: "100%",
  },
  tabContent: {
    marginBlockStart: tokens.spacingVerticalL,
  },
  listItemSkeleton: {}
});
