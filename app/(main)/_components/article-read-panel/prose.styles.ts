import { appTokens } from "@/theme/tokens";
import { tokens, makeStyles, shorthands } from "@fluentui/react-components";

export const useProseClasses = makeStyles({
  root: {
    color: tokens.colorNeutralForeground1,
    [appTokens.breakpoints.medium]: {
      maxWidth: "82ch",
    },
    [appTokens.breakpoints.xxl]: {
      maxWidth: "96ch",
    },
    lineHeight: tokens.lineHeightBase500, // Default line height
    fontSize: tokens.fontSizeBase300, // Default font size (16px)

    // Paragraphs
    "& p": {
      marginBlockStart: tokens.spacingVerticalL, // ~20px
      marginBlockEnd: tokens.spacingVerticalL,
    },

    // Lead paragraph
    '& [class~="lead"]': {
      color: tokens.colorNeutralForeground2,
      fontSize: tokens.fontSizeBase500, // ~20px
      lineHeight: tokens.lineHeightBase600, // ~32px
      marginBlockStart: tokens.spacingVerticalXL, // ~24px
      marginBlockEnd: tokens.spacingVerticalXL,
    },

    // Links
    "& a": {
      color: tokens.colorBrandForegroundLink,
      textDecorationLine: "underline",
      fontWeight: tokens.fontWeightSemibold,
      "&:hover": {
        color: tokens.colorBrandForegroundLinkHover,
        textDecorationLine: "underline",
      },
      "&:active": {
        color: tokens.colorBrandForegroundLinkPressed,
        textDecorationLine: "underline",
      },
    },

    // Strong / Bold
    "& strong": {
      color: tokens.colorNeutralForeground1, // Use a stronger foreground color if needed, else inherit
      fontWeight: tokens.fontWeightSemibold, // Or tokens.fontWeightBold
    },
    "& a strong": {
      color: "inherit", // Inherit from link color
    },
    "& blockquote strong": {
      color: "inherit", // Inherit from blockquote color
    },
    "& thead th strong": {
      color: "inherit", // Inherit from heading color
    },

    // Lists (ol, ul)
    "& ol": {
      listStyleType: "decimal",
      marginBlockStart: tokens.spacingVerticalL,
      marginBlockEnd: tokens.spacingVerticalL,
      paddingInlineStart: tokens.spacingHorizontalXXL, // Adjust as needed (~26px)
    },
    '& ol[type="1"]': { listStyleType: "decimal" }, // Default

    "& ul": {
      listStyleType: "disc",
      marginBlockStart: tokens.spacingVerticalL,
      marginBlockEnd: tokens.spacingVerticalL,
      paddingInlineStart: tokens.spacingHorizontalXXL, // Adjust as needed (~26px)
    },

    "& li": {
      marginBlockStart: tokens.spacingVerticalS, // ~8px
      marginBlockEnd: tokens.spacingVerticalS,
    },

    "& ol > li": {
      paddingInlineStart: tokens.spacingHorizontalS, // ~6px
    },
    "& ul > li": {
      paddingInlineStart: tokens.spacingHorizontalS, // ~6px
    },

    "& ol > li::marker": {
      fontWeight: tokens.fontWeightRegular,
      color: tokens.colorNeutralForeground3, // Counter color
    },
    "& ul > li::marker": {
      color: tokens.colorNeutralForeground3, // Bullet color
    },

    "& > ul > li p": {
      marginBlockStart: tokens.spacingVerticalM, // ~12px
      marginBlockEnd: tokens.spacingVerticalM,
    },
    "& > ul > li > p:first-child": {
      marginBlockStart: tokens.spacingVerticalL, // ~20px
    },
    "& > ul > li > p:last-child": {
      marginBlockEnd: tokens.spacingVerticalL, // ~20px
    },
    "& > ol > li > p:first-child": {
      marginBlockStart: tokens.spacingVerticalL, // ~20px
    },
    "& > ol > li > p:last-child": {
      marginBlockEnd: tokens.spacingVerticalL, // ~20px
    },

    "& ul ul, & ul ol, & ol ul, & ol ol": {
      marginBlockStart: tokens.spacingVerticalM, // ~12px
      marginBlockEnd: tokens.spacingVerticalM,
    },

    // Description List (dl, dt, dd)
    "& dl": {
      marginBlockStart: tokens.spacingVerticalL,
      marginBlockEnd: tokens.spacingVerticalL,
    },
    "& dt": {
      color: tokens.colorNeutralForeground1, // Heading color
      fontWeight: tokens.fontWeightSemibold,
      marginBlockStart: tokens.spacingVerticalL,
    },
    "& dd": {
      marginBlockStart: tokens.spacingVerticalS, // ~8px
      paddingInlineStart: tokens.spacingHorizontalXXL, // ~26px
    },

    // Horizontal Rule (hr)
    "& hr": {
      ...shorthands.borderColor(tokens.colorNeutralStroke2),
      ...shorthands.borderTop(tokens.strokeWidthThin, "solid", tokens.colorNeutralStroke2),
      ...shorthands.borderBottom("none"),
      ...shorthands.borderLeft("none"),
      ...shorthands.borderRight("none"),
      marginBlockStart: tokens.spacingVerticalXXXL, // ~48px
      marginBlockEnd: tokens.spacingVerticalXXXL,
    },
    "& hr + *": {
      marginBlockStart: "0",
    },

    // Blockquote
    "& blockquote": {
      fontWeight: tokens.fontWeightRegular, // Tailwind used 500, Fluent uses 400 for regular
      fontStyle: "italic",
      color: tokens.colorNeutralForeground2, // Quote color
      ...shorthands.borderLeft(tokens.strokeWidthThick, "solid", tokens.colorNeutralStroke1), // Quote border color
      quotes: '"\\201C""\\201D""\\2018""\\2019"',
      marginBlockStart: tokens.spacingVerticalXXL, // ~32px
      marginBlockEnd: tokens.spacingVerticalXXL,
      paddingInlineStart: tokens.spacingHorizontalL, // ~20px
    },
    "& blockquote p:first-of-type::before": {
      content: "open-quote",
    },
    "& blockquote p:last-of-type::after": {
      content: "close-quote",
    },

    // Headings (h1-h4)
    "& h1": {
      color: tokens.colorNeutralForeground1, // Heading color
      fontWeight: tokens.fontWeightBold, // Tailwind used 800
      fontSize: tokens.fontSizeHero800, // ~36px (adjust based on Fluent scale)
      lineHeight: tokens.lineHeightHero800, // ~40px
      marginBlockStart: "0", // Handled by spacing below or specific overrides
      marginBlockEnd: tokens.spacingVerticalXXL, // ~32px
    },
    "& h1 strong": {
      fontWeight: tokens.fontWeightBold, // Tailwind used 900, map to Fluent's Bold
      color: "inherit",
    },

    "& h2": {
      color: tokens.colorNeutralForeground1,
      fontWeight: tokens.fontWeightSemibold, // Tailwind used 700
      fontSize: tokens.fontSizeHero700, // ~24px
      lineHeight: tokens.lineHeightHero700, // ~32px
      marginBlockStart: tokens.spacingVerticalXXXL, // ~48px
      marginBlockEnd: tokens.spacingVerticalXL, // ~24px
    },
    "& h2 strong": {
      fontWeight: tokens.fontWeightBold, // Tailwind used 800
      color: "inherit",
    },

    "& h3": {
      color: tokens.colorNeutralForeground1,
      fontWeight: tokens.fontWeightSemibold, // Tailwind used 600
      fontSize: tokens.fontSizeBase500, // ~20px
      lineHeight: tokens.lineHeightBase500, // ~32px
      marginBlockStart: tokens.spacingVerticalXXL, // ~32px
      marginBlockEnd: tokens.spacingVerticalM, // ~12px
    },
    "& h3 strong": {
      fontWeight: tokens.fontWeightBold, // Tailwind used 700
      color: "inherit",
    },

    "& h4": {
      color: tokens.colorNeutralForeground1,
      fontWeight: tokens.fontWeightSemibold, // Tailwind used 600
      fontSize: tokens.fontSizeBase400, // ~16px (same as base, maybe increase slightly?)
      lineHeight: tokens.lineHeightBase400, // ~24px
      marginBlockStart: tokens.spacingVerticalXL, // ~24px
      marginBlockEnd: tokens.spacingVerticalS, // ~8px
    },
    "& h4 strong": {
      fontWeight: tokens.fontWeightBold, // Tailwind used 700
      color: "inherit",
    },

    // Spacing after headings
    "& h2 + *": { marginBlockStart: "0" },
    "& h3 + *": { marginBlockStart: "0" },
    "& h4 + *": { marginBlockStart: "0" },

    // Images, Pictures, Videos
    "& img, & picture, & video": {
      marginBlockStart: tokens.spacingVerticalXXL, // ~32px
      marginBlockEnd: tokens.spacingVerticalXXL,
      maxWidth: "100%", // Ensure images are responsive
      height: "auto",
    },
    "& picture": {
      display: "block", // From original styles
    },
    "& picture > img": {
      marginBlockStart: "0",
      marginBlockEnd: "0",
    },

    // Keyboard Input (kbd)
    "& kbd": {
      fontWeight: tokens.fontWeightSemibold, // Tailwind used 500
      fontFamily: tokens.fontFamilyMonospace, // Use monospace font
      color: tokens.colorNeutralForeground1,
      backgroundColor: tokens.colorNeutralBackground3,
      ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
      ...shorthands.borderRadius(tokens.borderRadiusMedium),
      ...shorthands.padding(
        tokens.spacingVerticalXS, // ~3px
        tokens.spacingHorizontalS // ~6px
      ),
      fontSize: tokens.fontSizeBase200, // Slightly smaller ~14px
      boxShadow: tokens.shadow2, // Use a subtle shadow token
    },

    // Inline Code
    "& code": {
      color: tokens.colorNeutralForeground2, // Subtle code color
      fontWeight: tokens.fontWeightSemibold, // Tailwind used 600
      fontSize: tokens.fontSizeBase200, // ~14px
      fontFamily: tokens.fontFamilyMonospace,
      backgroundColor: tokens.colorNeutralBackground3, // Subtle background
      ...shorthands.borderRadius(tokens.borderRadiusSmall),
      ...shorthands.padding("0.1em", "0.4em"), // Small padding
    },
    // Remove backticks for inline code in Fluent context
    "& code::before": { content: "none" },
    "& code::after": { content: "none" },

    "& a code": { color: "inherit" }, // Inherit link color
    "& h1 code, & h2 code, & h3 code, & h4 code, & blockquote code, & thead th code": {
      color: "inherit", // Inherit heading/blockquote color
      backgroundColor: "transparent", // Don't double background
      ...shorthands.padding("0"),
      fontSize: "inherit", // Match surrounding text size
    },

    // Code Blocks (pre > code)
    "& pre": {
      color: tokens.colorNeutralForegroundStaticInverted, // Text color on dark background
      backgroundColor: tokens.colorNeutralBackgroundStatic, // Dark background for code blocks
      overflowX: "auto",
      fontWeight: tokens.fontWeightRegular,
      fontFamily: tokens.fontFamilyMonospace,
      fontSize: tokens.fontSizeBase200, // ~14px
      lineHeight: tokens.lineHeightBase400, // ~24px / 14px
      marginBlockStart: tokens.spacingVerticalXL, // ~24px
      marginBlockEnd: tokens.spacingVerticalXL,
      ...shorthands.borderRadius(tokens.borderRadiusMedium), // ~6px
      ...shorthands.padding(
        tokens.spacingVerticalM, // ~12px
        tokens.spacingHorizontalL // ~16px
      ),
    },
    "& pre code": {
      // Reset styles for code inside pre
      backgroundColor: "transparent",
      ...shorthands.borderWidth(0),
      ...shorthands.borderRadius(0),
      ...shorthands.padding(0),
      fontWeight: "inherit",
      color: "inherit",
      fontSize: "inherit",
      fontFamily: "inherit",
      lineHeight: "inherit",
    },
    "& pre code::before": { content: "none" }, // No backticks in code blocks
    "& pre code::after": { content: "none" },

    // Tables
    "& table": {
      width: "100%",
      tableLayout: "auto",
      textAlign: "start",
      marginBlockStart: tokens.spacingVerticalXXL, // ~32px
      marginBlockEnd: tokens.spacingVerticalXXL,
      fontSize: tokens.fontSizeBase200, // ~14px
      lineHeight: tokens.lineHeightBase400, // ~24px / 14px
    },
    "& thead": {
      ...shorthands.borderBottom(tokens.strokeWidthThin, "solid", tokens.colorNeutralStroke1), // Heavier border for header
    },
    "& thead th": {
      color: tokens.colorNeutralForeground1, // Heading color
      fontWeight: tokens.fontWeightSemibold,
      verticalAlign: "bottom",
      paddingInlineEnd: tokens.spacingHorizontalS, // ~8px
      paddingBottom: tokens.spacingVerticalS, // ~8px
      paddingInlineStart: tokens.spacingHorizontalS, // ~8px
    },
    "& thead th:first-child": {
      paddingInlineStart: "0",
    },
    "& thead th:last-child": {
      paddingInlineEnd: "0",
    },
    "& tbody tr": {
      ...shorthands.borderBottom(tokens.strokeWidthThin, "solid", tokens.colorNeutralStroke2), // Lighter border for rows
    },
    "& tbody tr:last-child": {
      ...shorthands.borderBottom(0),
    },
    "& tbody td": {
      verticalAlign: "baseline", // Tailwind uses 'baseline', Fluent might default differently
      paddingTop: tokens.spacingVerticalS, // ~8px
      paddingInlineEnd: tokens.spacingHorizontalS, // ~8px
      paddingBottom: tokens.spacingVerticalS, // ~8px
      paddingInlineStart: tokens.spacingHorizontalS, // ~8px
    },
    "& tfoot": {
      ...shorthands.borderTop(tokens.strokeWidthThin, "solid", tokens.colorNeutralStroke1),
    },
    "& tfoot td": {
      verticalAlign: "top",
      paddingTop: tokens.spacingVerticalS,
      paddingInlineEnd: tokens.spacingHorizontalS,
      paddingBottom: tokens.spacingVerticalS,
      paddingInlineStart: tokens.spacingHorizontalS,
    },
    "& tbody td:first-child, & tfoot td:first-child": {
      paddingInlineStart: "0",
    },
    "& tbody td:last-child, & tfoot td:last-child": {
      paddingInlineEnd: "0",
    },

    // Figures and Captions
    "& figure": {
      marginBlockStart: tokens.spacingVerticalXXL, // ~32px
      marginBlockEnd: tokens.spacingVerticalXXL,
    },
    "& figure > *": {
      marginBlockStart: "0",
      marginBlockEnd: "0",
    },
    "& figcaption": {
      color: tokens.colorNeutralForeground3, // Caption color
      fontSize: tokens.fontSizeBase200, // ~14px
      lineHeight: tokens.lineHeightBase300, // ~20px / 14px
      marginBlockStart: tokens.spacingVerticalM, // ~12px
    },

    // Ensure first/last child margins are reset
    "& > :first-child": {
      marginBlockStart: "0",
    },
    "& > :last-child": {
      marginBlockEnd: "0",
    },
  },

  // Example for smaller text (sm)
  sm: {
    fontSize: tokens.fontSizeBase200, // 14px
    lineHeight: tokens.lineHeightBase300, // ~24px / 14px
    "& p": {
      marginBlockStart: tokens.spacingVerticalM, // ~16px
      marginBlockEnd: tokens.spacingVerticalM,
    },
    "& h1": {
      fontSize: tokens.fontSizeHero700, // ~30px? Adjust token
      lineHeight: tokens.lineHeightHero700, // ~36px?
      marginBlockEnd: tokens.spacingVerticalXL, // ~24px
    },
    "& h2": {
      fontSize: tokens.fontSizeBase500, // ~20px
      lineHeight: tokens.lineHeightBase500, // ~28px?
      marginBlockStart: tokens.spacingVerticalXXL, // ~32px
      marginBlockEnd: tokens.spacingVerticalM, // ~16px
    },
    // ... other overrides for sm size
  },

  // Example for larger text (lg)
  lg: {
    fontSize: tokens.fontSizeBase400, // 18px? Adjust token
    lineHeight: tokens.lineHeightBase600, // ~32px / 18px
    "& p": {
      marginBlockStart: tokens.spacingVerticalXL, // ~24px
      marginBlockEnd: tokens.spacingVerticalXL,
    },
    "& h1": {
      fontSize: tokens.fontSizeHero900, // ~48px?
      lineHeight: tokens.lineHeightHero900, // ~48px?
      marginBlockEnd: tokens.spacingVerticalXXXL, // ~40px?
    },
    "& h2": {
      fontSize: tokens.fontSizeHero800, // ~30px?
      lineHeight: tokens.lineHeightHero800, // ~40px
      marginBlockStart: tokens.spacingVerticalXXXL,
      marginBlockEnd: tokens.spacingVerticalXXL, // ~32px
    },
  },
});
