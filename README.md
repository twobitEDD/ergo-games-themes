# @twobitedd/ergo-games-themes

Community theme packs for [ERGO.games](https://ergo.games). Each pack ships a **JSON manifest** (metadata + contrast pairs) and a **CSS file** (semantic custom properties).

## Why a separate repo?

ERGO site chrome (`ergo-games-site`) owns routing and device shell law. **Color packs** live here so anyone can open a PR without touching game or hub code.

## Semantic tokens

Every theme defines these CSS variables under `[data-ergo-theme-pack="<id>"]`:

| Token | Role |
|-------|------|
| `--theme-surface` | Page / panel background |
| `--theme-surface-raised` | Cards, elevated panels |
| `--theme-text` | Body text (WCAG AA vs surface) |
| `--theme-text-muted` | Secondary labels |
| `--theme-accent` | ERGO orange or brand accent |
| `--theme-accent-text` | Text on accent buttons |
| `--theme-border` | Dividers and outlines |

Built-in slots:

- `ergo-default` — light console (owner paper palette)
- `ergo-dark` — dark console paint
- `ergo-paper-device` — fixed dark-on-paper inside device screen inset

## Install (monorepo / local)

```bash
# From ergo-games-site/package.json
"@twobitedd/ergo-games-themes": "file:../ergo-games-themes"
```

```css
@import '@twobitedd/ergo-games-themes/themes.css';
```

## Validate contrast

```bash
npm install
npm run validate
```

CI should run `npm run validate` on every PR.

## Add a theme

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Integration (ergo-games-site)

Paint preference stays on `data-ergo-theme` (`light` | `dark` | `system`). **Theme pack** is `data-ergo-theme-pack` on `<html>` or a scoped container. The site bridge maps `--theme-*` → legacy `--ergo-*` tokens during migration.

```ts
import { applyErgoThemePack } from '@/design/themes/apply-theme-pack';
applyErgoThemePack('ergo-default');
```

## License

MIT — theme JSON/CSS you contribute is MIT unless you state otherwise in `theme.json`.
