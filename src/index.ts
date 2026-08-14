export {
  THEME_TOKEN_KEYS,
  type ErgoThemeManifest,
  type ErgoThemeRegistry,
  type ThemeContrastPair,
  type ThemePaintSlot,
  type ThemeTokenKey
} from './schema.js';

export { contrastRatio, relativeLuminance, validateThemeContrast, type ContrastViolation } from './contrast.js';

/** Built-in theme pack ids shipped in this repository. */
export const BUILTIN_THEME_PACK_IDS = ['ergo-default', 'ergo-dark', 'ergo-paper-device'] as const;

export type BuiltinThemePackId = (typeof BUILTIN_THEME_PACK_IDS)[number];

export const DEFAULT_THEME_PACK_ID: BuiltinThemePackId = 'ergo-default';
