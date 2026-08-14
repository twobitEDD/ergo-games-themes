#!/usr/bin/env node
/**
 * Validates every theme.json in themes/ for required keys and WCAG contrast pairs.
 * Run: npm run validate
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const themesRoot = join(__dirname, '..', 'themes');

function contrastRatio(fg, bg) {
  const lum = (hex) => {
    const raw = hex.replace(/^#/, '');
    const expand = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
    const channels = [
      parseInt(expand.slice(0, 2), 16),
      parseInt(expand.slice(2, 4), 16),
      parseInt(expand.slice(4, 6), 16)
    ].map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const l1 = lum(fg);
  const l2 = lum(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const REQUIRED_TOKENS = [
  'surface',
  'surfaceRaised',
  'text',
  'textMuted',
  'accent',
  'accentText',
  'border'
];

const dirs = readdirSync(themesRoot).filter((name) => {
  if (name.startsWith('_') || name === 'registry.json' || name.endsWith('.css')) return false;
  return statSync(join(themesRoot, name)).isDirectory();
});

let failed = false;

for (const dir of dirs) {
  const manifestPath = join(themesRoot, dir, 'theme.json');
  const cssPath = join(themesRoot, dir, 'theme.css');
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch (err) {
    console.error(`✗ ${dir}: missing or invalid theme.json (${err.message})`);
    failed = true;
    continue;
  }

  try {
    readFileSync(cssPath, 'utf8');
  } catch {
    console.error(`✗ ${dir}: missing theme.css`);
    failed = true;
    continue;
  }

  for (const key of REQUIRED_TOKENS) {
    if (!manifest.tokens?.[key]) {
      console.error(`✗ ${manifest.id ?? dir}: missing token "${key}"`);
      failed = true;
    }
  }

  for (const pair of manifest.contrastPairs ?? []) {
    const fg = manifest.tokens?.[pair.foreground];
    const bg = manifest.tokens?.[pair.background];
    if (!fg || !bg) continue;
    const ratio = contrastRatio(fg, bg);
    if (ratio < pair.minRatio) {
      console.error(
        `✗ ${manifest.id}: ${pair.foreground} on ${pair.background} = ${ratio.toFixed(2)} (need ${pair.minRatio})`
      );
      failed = true;
    } else {
      console.log(`  ✓ ${manifest.id}: ${pair.foreground}/${pair.background} = ${ratio.toFixed(2)}`);
    }
  }

  if (!failed) {
    console.log(`✓ ${manifest.id} (${manifest.name})`);
  }
}

if (failed) {
  process.exit(1);
}

console.log(`\nValidated ${dirs.length} theme pack(s).`);
