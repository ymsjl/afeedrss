import { appTokens } from "@/theme/tokens";
import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useClasses = makeStyles({
  root:{
    overflowY: 'auto',
    maxHeight: '100%',
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  footerButtons: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    width: '100%',
    paddingBlock: tokens.spacingVerticalS,
    overflowX: "scroll",
    [appTokens.breakpoints.medium]: {
      paddingBlockEnd: tokens.spacingVerticalXL,
    }
  },
  footerButton: {
    maxWidth: "100%",
    flexGrow: 1,
    flexDirection: 'column',
    fontSize: tokens.fontSizeBase200
  },
  list: {
    listStyleType: "none",
    marginBlockStart: tokens.spacingVerticalXS,


    "> *": {
      marginInline: tokens.spacingVerticalXS,
    },

    "> *:not(:last-child)": {
      marginBlockEnd: tokens.spacingVerticalXXS,
    },
  },

  listItem: {
    backgroundColor: tokens.colorNeutralBackground1,
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground2Hover,
    },
    ":first-child": {
      ...shorthands.borderRadius(tokens.borderRadiusMedium, tokens.borderRadiusMedium, 0, 0),
    },
    ":last-child": {
      ...shorthands.borderRadius(0, 0, tokens.borderRadiusMedium, tokens.borderRadiusMedium),
    },
  },

  sectionHeader: {
    marginInline: tokens.spacingVerticalS,
    '&:not(:first-child)': {
      marginBlockStart: tokens.spacingVerticalL,

    },
    marginBlockEnd: tokens.spacingVerticalS,
  },

  rowItem: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    paddingBlock: tokens.spacingVerticalS,
    paddingInline: tokens.spacingHorizontalM,
    cursor: "pointer",
  },
  rowLabel: {
    flex: 1,
    padding: tokens.spacingVerticalS,
  },
  rowAction: {

  },
  rowIcon: {
    margin: tokens.spacingVerticalSNudge,
  },
  radioGroup: {
    width: '100%',
    alignItems: 'stretch',
    gap: tokens.spacingHorizontalS,
  },

  radio: {
    width: "100%",
    paddingBlock: tokens.spacingVerticalS,
    paddingInline: tokens.spacingHorizontalM,
    cursor: "pointer",
  },

  radioInput: {
    width: '100%',
  },
});
