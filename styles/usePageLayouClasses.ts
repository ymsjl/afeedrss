import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const usePageLayoutClasses = makeStyles({
  main: {
    flex: 1,
    height: '100%',
    marginBlockStart: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground3,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    ...shorthands.borderRadius(
      tokens.borderRadiusXLarge,
      0,
      0,
      0
    ),
  },
  content: {
    marginInline: "auto",
    maxWidth: "64rem",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    paddingInlineEnd: tokens.spacingHorizontalL,
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    background: "inherit",
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalXS, tokens.spacingVerticalM),
  },
})