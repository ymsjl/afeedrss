import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useClasses = makeStyles({
  navDrawerMobile: {
    width: '100%',
    height: '100%',
    backgroundColor: 'unset'
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
});
