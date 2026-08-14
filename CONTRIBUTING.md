# Contributing themes

Thank you for improving ERGO.games readability. This repo is **theme packs only** — no React, no hub routes.

## Quick checklist

1. Copy `themes/_template/` → `themes/<your-theme-id>/`
2. Edit `theme.json` (metadata + hex tokens + contrast pairs)
3. Edit `theme.css` (same id in `[data-ergo-theme-pack='…']`)
4. Register in `themes/registry.json`
5. Add `@import './<your-theme-id>/theme.css';` to `themes/index.css`
6. Run `npm run validate` — all contrast pairs must pass
7. Open a PR with screenshots (light + dark if applicable)

## Theme id rules

- Lowercase kebab-case: `forest-night`, `retro-terminal`
- Must match folder name and CSS selector
- Must be unique across the registry

## Required tokens

All seven keys in `theme.json` → `tokens`:

`surface`, `surfaceRaised`, `text`, `textMuted`, `accent`, `accentText`, `border`

Use **6-digit hex** in manifests so `npm run validate` can compute WCAG ratios.

## Contrast law (WCAG 2.1 AA)

Every theme **must** declare these pairs (minimum ratio **4.5** for body text):

```json
{ "foreground": "text", "background": "surface", "minRatio": 4.5 },
{ "foreground": "textMuted", "background": "surface", "minRatio": 4.5 },
{ "foreground": "accentText", "background": "accent", "minRatio": 4.5 }
```

Optional: add pairs for `surfaceRaised` backgrounds if body copy appears there.

## Slots

Set `slots` in `theme.json` to help integrators:

| Slot | When to use |
|------|-------------|
| `light` | Default console / personal shelf |
| `dark` | Dark paint preference |
| `paper-device` | Device screen inset only (does not flip with global dark) |

## CSS file

Map manifest tokens to `--theme-*` variables only. Do **not** import site-specific selectors.

```css
[data-ergo-theme-pack='your-theme-id'] {
  --theme-surface: #…;
  /* … */
}
```

## Review process

1. Automated: `npm run validate`
2. Maintainers: visual check on `/dev/visual-lab` after ergo-games-site bumps the package
3. Merge → npm publish or site `file:` link update (maintainer)

## What we won't merge

- Tokens that fail WCAG AA on declared pairs
- Themes that hide catalog games or change hub IA
- Secrets, tracking pixels, or remote font loads without disclosure

## Questions

Open a GitHub Discussion on [twobitENT/ergo-games-themes](https://github.com/twobitENT/ergo-games-themes) or tag `@twobitENT` in your PR.
