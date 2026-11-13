export const colorValueType = `
/**
 * Slice color token type keys all available theme color tokens
 */
export type ColorToken = keyof Colors;

/**
 * Color props implement ColorValue, providing autocomplete for
 * theme color tokens, while retaining arbitrary CSS colors.
 */
export type ColorValue = ColorToken | (string & {});

// so this is a value you can pass to any slice color prop
const myColor: ColorValue = "core-surface-primary"
`;
