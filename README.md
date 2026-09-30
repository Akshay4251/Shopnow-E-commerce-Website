# Shop UI — Common Component Library

Reusable UI components and design tokens for the e-commerce clone project, styled to match Amazon's UI/UX (dark navbar, yellow/orange CTAs, teal links, black bold prices).
Plain HTML/CSS + jQuery — no build step, works alongside Bootstrap.

## Files

```
ui-library/
├── style-guide.html     ← open this in a browser to see every component live
├── css/
│   ├── design-tokens.css   ← colors, type scale, spacing scale (edit here only)
│   └── components.css      ← navbar, footer, buttons, cards, forms, modal, etc.
└── js/
    └── components.js       ← modal open/close, alert dismiss, form validation,
                               mobile nav toggle, loading-spinner helpers
```

## How to use this in your page (M2–M13)

1. Copy the `css/` and `js/` folders into the shared repo (e.g. `/assets/`).
2. In every page's `<head>`, **after** Bootstrap's CSS (if used):
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
   <link rel="stylesheet" href="assets/css/design-tokens.css">
   <link rel="stylesheet" href="assets/css/components.css">
   ```
3. Before `</body>`, **after** jQuery and Bootstrap's JS (if used):
   ```html
   <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
   <script src="assets/js/components.js"></script>
   ```
4. Open `style-guide.html`, find the component you need, copy its markup, paste it into your page.

## Amazon-style tokens to know

- `--color-cta-500` (yellow `#FFD814`) — the main **Add to Cart** button (`.btn--primary`)
- `--color-cta2-500` (orange `#FFA41C`) — **Buy Now** style button (`.btn--secondary`)
- `--color-accent-500` (orange `#FF9900`) — navbar search button, ribbons
- `--color-primary-700` (`#131921`) — navbar top bar / `--color-primary-500` (`#232F3E`) — navbar category bar
- `--color-link-500` (teal `#007185`) — links, product titles, "See reviews"
- `--color-danger-500` (`#B12704`) — deal/strikethrough price, error states
- Fonts: no Google Font import — a system stack (Segoe UI / Roboto / Arial fallback) stands in for Amazon Ember

## Rules for everyone on the team

- **Never hard-code a color, font-size, or spacing value.** Use the CSS variables in `design-tokens.css` (e.g. `var(--color-cta-500)`, `var(--space-4)`). If a value you need doesn't exist as a token, add it to `design-tokens.css` and tell the team in the group chat — don't invent a one-off value in your own page.
- **Don't edit `components.css` / `components.js` for a one-page tweak.** If a component doesn't fit your page, add a small `<style>` override scoped to your page instead of changing the shared file, so you don't break someone else's page. If the change is genuinely useful for everyone, raise it as a PR against this folder.
- **Components work with or without Bootstrap.** `.container` and `.grid` here are custom (not Bootstrap's) so they still work on pages that don't load Bootstrap at all. It's fine to also use Bootstrap's grid on a page — just don't mix `.container` from both systems in the same wrapper.
- **All data goes through the fake API / localStorage**, never a real backend — the component markup doesn't assume any particular data source, so this applies the same regardless of which module you're building.

## Component checklist

| Component | Classes | Notes |
|---|---|---|
| Navbar | `.navbar` | Sticky, collapses to hamburger under 768px |
| Footer | `.footer` | 4-column grid, stacks on mobile |
| Buttons | `.btn .btn--primary/secondary/outline/ghost/danger` | + `--sm/--lg/--block` |
| Product card | `.product-card` | Badge, wishlist toggle, price + old price |
| Forms | `.form-group .form-control .form-check` | Add `data-validate` to `<form>` for auto validation |
| Modal | `.modal` + `.modal-backdrop` | Open with `data-modal-open="id"` |
| Alerts | `.alert .alert--success/danger/warning/info` | Dismissible via `.alert__close` |
| Badges | `.badge .badge--sale/new/out/success/warning/neutral/count` | |
| Spinner | `.spinner` (`--sm/--lg`) or `showLoading()`/`hideLoading()` | Use around fake-API calls |
| Empty state | `.empty-state` | Cart, wishlist, search-results-empty, etc. |

See `style-guide.html` for copy-pasteable markup for each of these.
