import tokens from './tokens'

export type SpacingToken = keyof typeof tokens.spacing

export const spacing = tokens.spacing

/** Layout rhythm (DESIGN.md section 6). */
export const layout = tokens.layout
