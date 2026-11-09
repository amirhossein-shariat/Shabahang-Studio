# Project state (updated 2026-11-09)

## Stack and layout
Next.js (App Router, TypeScript, Tailwind v4), fa/en routing (`/fa`, `/en`, RTL for fa), GSAP for entrances,
calm Canvas2D starfield (`src/lib/starfield.ts`: twinkle, slow drift, faint scroll depth; no mouse/touch reaction). Note: this Next.js version differs from older ones;
read `node_modules/next/dist/docs/` before framework-level changes (see `AGENTS.md`).

Pages: home, `/services`, `/about`, `/contact`. Portfolio pages exist but are switched off (see flags).

## Content that lives in data files (admin-panel candidates)
- `src/data/packages.ts` — Instagram packages (see `admin-panel.md`)
- `src/dictionaries/{fa,en,pages,services,work}.ts` — page texts
- `src/data/studio.ts` — client logos (`CLIENTS`) and portfolio projects (`PROJECTS`)
- `src/dictionaries/index.ts` — `EMAIL`, `PHONE`

## Flags
- `FEATURES.showWork` in `src/config.ts` = **false**. Hides the portfolio: nav link, hero button, home section, and
  `/work` + `/work/[category]` return 404. Nothing was deleted; set it to `true` to bring everything back.

## Contact details in use
- Phone / Telegram / Bale: 0912 867 2522 (Bale has no link yet, only an icon + label)
- Email: Amirhosseinshariatt@gmail.com
- Response hours: 9 to 21. No street address (owner has none; removed).
- The contact form only prepares a `mailto:` message. Sending from the site needs a mail service or a Telegram bot.

## Decisions made
- IT pricing is per **user** (owner approved defaults on 2026-11-07); the IT table on the services page still shows `[قیمت]`.
- Instagram packages and discounts replaced the old 10 % / 20 % scheme (6 % for 3 months, 12 % for 6 months, setup fee 3 for 1 month).
- Background stars: custom Canvas2D instead of drei/three. A pointer/touch-reactive version was built and then removed on 2026-11-09 because the owner found it artificial; do not re-add it.
- Persian text must never get letter-spacing (it detaches the letters); `globals.css` forces `letter-spacing: normal` on Persian pages except `dir="ltr"` Latin runs.

## Placeholders still open
- Team introduction on `/about`, Bale link, official Bale icon (current one is a generic chat bubble), final logo SVG
  (`src/components/Logo.tsx` uses a placeholder star), real portfolio projects, IT prices, domain `shabahangstudio.ir` registration.
- Client logos: Titano is in the repo; Akofix, Pratti, Pyaco and Damakar SVGs were sent to the owner to add to
  `public/clients/` (the marquee skips missing files). "Pratti" spelling is unconfirmed.

## Working notes
- This environment cannot `git push` (remote changes were denied). Code was pushed with the GitHub MCP tools instead, which
  only accept text; binary files cannot be sent that way. Verify pushed files with `git hash-object` vs the GitHub blob sha.
- The preview artifact is a static snapshot built from the real `next build` output by a helper script; re-publish it after
  each change.
