const breakpoints = {
  small: 0,
  medium: 480,
  large: 640,
  xl: 1024,
  xxl: 1366,
  xxxl: 1926,
}

type BreakpointRecords = Record<keyof typeof breakpoints, string>

export const breakpointQuerys = Object
  .entries(breakpoints)
  .reduce((acc, [key, value]) => ({ ...acc, [key]: `(min-width: ${value}px)` }), {} as BreakpointRecords)

export const appTokens = {
  breakpoints: Object
    .entries(breakpointQuerys)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: `@media ${value}` }), {} as BreakpointRecords)
}