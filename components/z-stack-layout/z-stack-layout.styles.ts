import { makeStyles, tokens } from "@fluentui/react-components";

export const useClasses = makeStyles({
  stackLayer: {
    transition: "transform 0.2s ease-in-out",
    willChange: "transform",
    transform: "translateX(0)",
    opacity: 1,
  },
  firstChildOnLeft: {
    transform: "translateX(-100%)",
    opacity: 0,
  },
  secondChildOnRight: {
    transform: `translateX(calc(100% + ${tokens.spacingHorizontalM}))`,
  }
});
