# Project state (updated 2026-11-09)

## Stack and layout
Next.js (App Router, TypeScript, Tailwind v4), fa/en routing (`/fa`, `/en`, RTL for fa), motion done in CSS (GSAP was removed, see below),
calm Canvas2D starfield (`src/lib/starfield.ts`: twinkle, slow drift, faint scroll depth; no mouse/touch reaction). Note: this Next.js version differs from older ones;
read `node_modules/next/dist/docs/` before framework-level changes (see `AGENTS.md`).

Pages: home, `/services`, `/about`, `/contact`, `/login`, `/panel` (demo panels, see `panels-status.md`). Portfolio pages exist but are switched off (see flags).

## Content that lives in data files (admin-panel candidates)
- `src/data/packages.ts` — Instagram packages (see `admin-panel.md`)
- `src/data/services.ts` — the five pillars + sub-services (home cards, services page, naming; see `naming-research.md`)
- `src/dictionaries/{fa,en,pages,services,work}.ts` — page texts
- `src/data/studio.ts` — client logos (`CLIENTS`) and portfolio projects (`PROJECTS`)
- `src/dictionaries/index.ts` — `EMAIL`, `PHONE`

## Flags
- `FEATURES.showLogin` in `src/config.ts` = true: sign-in + sign-up page and header link. UI only, see `auth-and-panels.md`.
- `FEATURES.demoPanel` in `src/config.ts` = true: demo client / CEO panels with fixed preview accounts (2222 and 1111). Demo only; remove before production, see `panels-status.md`.
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
- Motion (2026-11-09): CSS only. Page-in on every `main`, hero entrance (`.hero-rise`, `.title-in`, `.star-in`, `.rings-in`), scroll-driven reveals (`animation-timeline: view()`, only where supported; content is fully visible otherwise), drifting nebula, 3 rare CSS shooting stars in `Sky.tsx`, scroll progress line, nav underline, button light-sweep, card hover lift, package price pop and band shine. No mouse/touch-reactive effects (owner dislikes them). `prefers-reduced-motion` turns it all off. GSAP was removed from dependencies.
- Forms: text fields show focus with the gold border only (global outline is switched off for them in `globals.css`); selects use `.select-field` with a custom chevron; placeholders follow page direction.
- Sticky footer: `body` is a flex column and `body > main` grows, so the footer sits at the bottom of short pages.
- No SMS for sign-up/sign-in, ever (owner's rule).
- Persian text must never get letter-spacing (it detaches the letters); `globals.css` forces `letter-spacing: normal` on Persian pages except `dir="ltr"` Latin runs.

## Placeholders still open
- Team introduction on `/about`, Bale link, official Bale icon (current one is a generic chat bubble), final logo SVG
  (`src/components/Logo.tsx` uses a placeholder star), real portfolio projects, IT prices, domain `shabahangstudio.ir` registration.
- Client logos: Titano is in the repo; Akofix, Pratti, Pyaco and Damakar SVGs were sent to the owner to add to
  `public/clients/` (the marquee skips missing files). "Pratti" spelling is unconfirmed.

## Working notes
- `git push` to the branch works now (2026-11-11). Earlier rounds used the GitHub MCP tools (text only). Entry point for any new AI: `docs/AI-CONTEXT.md`.
- The preview artifact is a static snapshot built from the real `next build` output by a helper script; re-publish it after
  each change.

## صفحه‌ی اختصاصی هر خدمت، سوالات متداول و IT (به‌روز: ۲۰۲۶-۱۱-۱۰)
- هر خدمت صفحه‌ی جدا دارد: `/[lang]/services/{brand|web|growth|it|product}`؛ `/services` فقط نمای کلی و کارت‌های لینک است.
- سوالات متداول هر خدمت: `src/data/faq.ts` (تعداد پرسش‌ها آزاد است؛ کاروسل + نمای فهرست + کارت «پرسش من اینجا نبود»). ویرایش از پنل ادمین = آینده؛ فعلاً داده‌محور. پاسخ‌های غیر IT فقط واقعیت‌های موجود سایت را تکرار می‌کنند.
- IT طبق بریف مالک: `src/data/it.ts` (دو پکیج IT Basic / IT Professional، ماهانه/سه‌ماهه، ۱۸ خدمت پروژه‌ای در ۶ گروه با قابلیت انتخاب، تعرفه‌ی خارج از پکیج، شرایط قرارداد، CTA). تغییر قیمت: فقط `IT_PLANS[...].monthly/quarterly`.
- انتخاب خدمات پروژه‌ای و دکمه‌ی «مشکلم در فهرست نبود» به فرم تماس پیش‌پر می‌فرستند (sessionStorage `sh-prefill`، `src/lib/enhance.ts`).
- باید مالک تأیید کند: قیمت‌ها، ساعت پشتیبانی، شهرهای حضوری، مالیات (VAT)، مسیر تماس، بازه‌ی تست بکاپ، ارزیابی رایگان. محتوای IT فقط فارسی است (`/en` همان را نشان می‌دهد).
