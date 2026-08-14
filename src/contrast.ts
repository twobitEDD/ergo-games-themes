import type { ErgoThemeManifest, ThemeTokenKey } from './schema.js';

function channelLuminance(channel: number): number {
  const s = channel / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function parseHex(hex: string): [number, number, number] | null {
  const raw = hex.trim().replace(/^#/, '');
  if (raw.length === 3) {
    return [
      parseInt(raw[0]! + raw[0], 16),
      parseInt(raw[1]! + raw[1], 16),
      parseInt(raw[2]! + raw[2], 16)
    ];
  }
  if (raw.length === 6) {
    return [
      parseInt(raw.slice(0, 2), 16),
      parseInt(raw.slice(2, 4), 16),
      parseInt(raw.slice(4, 6), 16)
    ];
  }
  return null;
}

export function relativeLuminance(hex: string): number {
  const rgb = parseHex(hex);
  if (!rgb) return 0.5;
  const [r, g, b] = rgb.map(channelLuminance);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foregroundHex: string, backgroundHex: string): number {
  const l1 = relativeLuminance(foregroundHex);
  const l2 = relativeLuminance(backgroundHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export type ContrastViolation = {
  pair: ErgoThemeManifest['contrastPairs'][number];
  ratio: number;
};

export function validateThemeContrast(manifest: ErgoThemeManifest): ContrastViolation[] {
  const violations: ContrastViolation[] = [];

  for (const pair of manifest.contrastPairs) {
    const fg = manifest.tokens[pair.foreground as ThemeTokenKey];
    const bg = manifest.tokens[pair.background as ThemeTokenKey];
    if (!fg || !bg) continue;

    const ratio = contrastRatio(fg, bg);
    if (ratio < pair.minRatio) {
      violations.push({ pair, ratio });
    }
  }

  return violations;
}
