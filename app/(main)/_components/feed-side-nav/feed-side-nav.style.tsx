import { appTokens } from "@/theme/tokens";
import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useClasses = makeStyles({
  nav: {
    flexShrink: 0,
    backgroundColor: tokens.colorNeutralBackground4,
    [appTokens.maxBreakpoints.small]: {
      width: '100%',
      ...shorthands.borderRadius(tokens.borderRadiusXLarge, tokens.borderRadiusXLarge, 0, 0),
    }
  },
  navDrawerMobile: {
    width: '100%',
    height: '100%',
    backgroundColor: 'unset'
  },
  navItem: {
    display: "flex",
    width: "100%",
    alignItems: "center",
  },
  navDrawerBody: {
    overscrollBehaviorY: 'contain',
  },
  navItemMobile: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: 0,

    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1,
    },

    ':first-child': {
      ...shorthands.borderRadius(tokens.borderRadiusMedium, tokens.borderRadiusMedium, 0, 0),
    },

    ':last-child': {
      ...shorthands.borderRadius(0, 0, tokens.borderRadiusMedium, tokens.borderRadiusMedium),
    },
  },
  skeleton: {
    marginBlockEnd: tokens.spacingVerticalXXS
  },
  skeletonItem: {
    height: '40px',
  },

  avatar: {
    display: 'inline-block',
    width: '32px',
    height: '32px',
    ...shorthands.borderRadius('9999px'),
  }
});
