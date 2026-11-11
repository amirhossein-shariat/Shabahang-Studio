# Admin panel — requirements (NOT BUILT YET)

The owner asked that **everything on the Instagram packages section be editable or removable from an admin panel**.
Until the panel exists, the single source of truth is `src/data/packages.ts` (type `PackagesConfig`). The page
(`src/components/InstagramPackages.tsx`) renders only from that object, so the panel only has to read and write it.

## What must be editable
- **Section texts** (fa + en): kicker, title, subtitle, footnote, currency label, duration title, monthly-equivalent label,
  "incl. setup fee", discount label, CTA label, included / not-included labels.
- **Cards (plans)**: add, remove, hide (`enabled`), reorder. Any number of cards, not just three.
  Per card: name, tier colour (bronze / silver / gold), badge text (or none), base monthly price, and the list of rows.
- **Rows inside a card**: add, remove, reorder; each has a label and a value (fa + en) and an "not included" flag (`off`).
  Rows are per card, so cards can have different rows.
- **Durations**: add, remove, hide; each has months, discount percent, one-time setup fee, label (fa + en).
- **Prices**: the owner sets the *base monthly price* per card and the *discount percent* per duration. Nothing else is typed.

## Price rules (already implemented in `priceFor()` — keep them identical in the panel preview)
```
monthly = round2(basePrice × (1 − discountPercent / 100))
total   = round2(basePrice × (1 − discountPercent / 100) × months + setupFee)
```
The big price on each card is the **total for the whole contract length** (owner's rule, 2026-11-09); the monthly equivalent is a small line under it.
The 3-month duration opens selected (`default: true` on that duration; the panel should let the owner pick which one is the default).
Unit is `currency` (currently "million toman"). Current values: 1 month = 0 % + 3 setup, 3 months = 6 %, 6 months = 12 %.
Verified against the owner's numbers: 1 month 13 / 23 / 38; 3 months 9.4 / 18.8 / 32.9 monthly, 28.2 / 56.4 / 98.7 total;
6 months 8.8 / 17.6 / 30.8 monthly, 52.8 / 105.6 / 184.8 total.

## Beyond packages (also wanted in the panel, lower priority)
- The five service pillars and their sub-services (`src/data/services.ts`): names, taglines, summaries, models, sub-service cards and icons.
- Titles and descriptions of the other pages (home, services, about, contact), in both languages (`src/dictionaries/*`).
- IT package table on the services page (`src/dictionaries/services.ts`, key `it`) — same add / remove / edit needs.
- Client logos for the home marquee (`src/data/studio.ts` → `CLIENTS`, files in `public/clients/`): upload, remove, reorder,
  display height. The marquee already skips logos whose file is missing.
- Portfolio projects (`PROJECTS` in `src/data/studio.ts`) and the switch that shows/hides portfolio pages
  (`FEATURES.showWork` in `src/config.ts`, currently **false**).
- Contact details (`EMAIL`, `PHONE` in `src/dictionaries/index.ts`) and response hours (`src/dictionaries/pages.ts`).

Sign-in rules (one login, role detected after credentials, **no SMS**) are in `auth-and-panels.md`.

## Decisions still open before building it
1. **Where the site is hosted** (the panel needs a server or serverless runtime; a purely static host cannot save edits).
2. **Where edits are stored**: database/KV, or commits to the Git repo (content as JSON files). Commits keep history and
   need no database, but rebuild the site on every save.
3. **Login**: a single owner account is enough at first; use a hashed password or an OAuth provider. No secrets in the repo.
4. **Persian digits and RTL** must be supported in all inputs; previews should show fa and en side by side.

## Suggested shape
- Move `INSTAGRAM_PACKAGES` into a JSON file (or DB row) with the same type; `packages.ts` then only loads and validates it.
- Route `/admin` (excluded from the sitemap, `noindex`), forms generated from the `PackagesConfig` type, live preview using the
  real `InstagramPackages` component, "reset to defaults" button.
- Validate: base price ≥ 0, discount 0–100, months ≥ 1, at least one enabled card and one enabled duration.

## ویرایش‌پذیری از پنل ادمین (افزوده)
- سوالات متداول هر خدمت (افزودن/حذف/ترتیب، fa/en) ← `src/data/faq.ts`.
- قیمت و محتوای پکیج‌های IT و خدمات پروژه‌ای ← `src/data/it.ts`.
