const breakpoints = {
  small: [0, 480],
  medium: [480, 640],
  large: [640, 1024],
  xl: [1024, 1366],
  xxl: [1366, 1926],
  xxxl: [1926, 2560],
}

type BreakpointRecords = Record<keyof typeof breakpoints, string>

export const breakpointQuerys = Object
  .entries(breakpoints)
  .reduce((acc, [key, value]) => ({ ...acc, [key]: `(min-width: ${value[0]}px)` }), {} as BreakpointRecords)

export const maxBreakpointQuerys = Object
  .entries(breakpoints)
  .reduce((acc, [key, value], ) => ({ ...acc, [key]: `(max-width: ${value[1]}px)` }), {} as BreakpointRecords)

export const appTokens = {
  breakpoints: Object
    .entries(breakpointQuerys)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: `@media ${value}` }), {} as BreakpointRecords),

  maxBreakpoints: Object
    .entries(maxBreakpointQuerys)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: `@media ${value}` }), {} as BreakpointRecords)
}