/** Semantic token keys every ERGO theme pack must define. */
export const THEME_TOKEN_KEYS = [
  'surface',
  'surfaceRaised',
  'text',
  'textMuted',
  'accent',
  'border',
  'accentText'
] as const;

export type ThemeTokenKey = (typeof THEME_TOKEN_KEYS)[number];

export type ThemePaintSlot = 'light' | 'dark' | 'paper-device';

export type ThemeContrastPair = {
  /** Token key used as foreground. */
  foreground: ThemeTokenKey;
  /** Token key used as background. */
  background: ThemeTokenKey;
  /** WCAG contrast ratio minimum (4.5 = AA body text). */
  minRatio: number;
};

/** JSON manifest shipped beside each theme's theme.css. */
export type ErgoThemeManifest = {
  id: string;
  name: string;
  version: string;
  author: string;
  license: string;
  description?: string;
  /** Which paint contexts this pack targets. */
  slots: ThemePaintSlot[];
  tokens: Record<ThemeTokenKey, string>;
  contrastPairs: ThemeContrastPair[];
};

export type ErgoThemeRegistry = {
  schemaVersion: 1;
  themes: Array<{
    id: string;
    manifest: string;
    css: string;
  }>;
};
