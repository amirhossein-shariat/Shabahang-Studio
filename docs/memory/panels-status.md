# Panels — status (2026-11-10)

Source of decisions: `docs/shabahang-panels-spec.md` (owner's panel spec). Permanent rules: `CLAUDE.md` (section 0, copied verbatim, do not edit).

## Built now: DEMO prototype only
- Routes `/fa/panel` and `/en/panel` (Persian-only UI, `noindex`), behind `FEATURES.demoPanel` in `src/config.ts`.
- **Demo accounts (browser-only, protect nothing):** `2222` / `2222` = client panel, `1111` / `1111` = CEO panel. Defined in `src/lib/panel/demo.ts`.
  Any other ID or password gives the generic error "شناسه یا رمز عبور درست نیست." (same message for unknown ID and wrong password).
  The sign-in page has no role picker; the role comes from the account.
- The session and all sample data live in `sessionStorage` (`sh-demo-session`, `sh-demo-data`); drafts of messages autosave there; "بازنشانی داده‌های نمایشی" resets it.
- UI source: `src/lib/panel/panel.ts` (string-rendered, shared by the Next page through `src/components/PanelClient.tsx` and by the static preview).
- Client panel: پیشخوان (action items, active packages with remaining-time bar and تمدید, running projects, notifications, messages) · پروژه‌ها (stage stepper, reports timeline with visible-to-client only, content calendar, تحویل with تأیید / درخواست ویرایش, 5-star rating, complementary-service suggestion) · پیام‌ها (inbox with CEO and executor, attachment limit 3 MB checked, voice limited to 2 minutes is a stub) · فایل‌ها · امور مالی (unofficial invoice units, card-to-card, receipt upload, statuses unpaid / pending / paid / rejected with reason) · سفارش جدید · اعلان‌ها · حساب کاربری (5-step آموزش, first-visit prompt "شروع آموزش / بعداً").
- CEO panel: پیشخوان · کاربران و حساب‌ها (approve / reject pending accounts, role change only by CEO) · رسیدها و فاکتورها (approve, reject with reason) · پروژه‌ها (CEO can toggle stages) · پیام‌ها · اعلان‌ها · لاگ ممیزی (append-only list in the demo) · امور مالی (🔒 protected placeholder, no data, owner completes it) · حساب کاربری.
- Client actions show up for the CEO and the other way round (uploading a receipt creates a pending receipt; approving it updates the client).

## NOT built (per spec, do not build without the owner)
- Real backend: Node server, PostgreSQL, S3 storage, SMTP, real auth (email verification → admin approval, TOTP, lockout, CSRF, hashed passwords), server-side access control, real audit log. All of this needs the hosting decision (spec section 12: Liara PaaS + managed DB + S3 suggested; prices unchecked).
- Executor (staff) panel: waiting for the owner's answers to the 3 questions in spec section 8.
- Admin-only panel: waiting for the owner's invoice-format md file; package editing, invoice and instalment builder, stage templates are not built.
- CEO finance section: owner completes it himself; the task must not be closed (spec section 10).
- Telegram admin alerts, e-mail notifications, PWA (only registered in the plan; manifest / service worker intentionally not built), online payment gateway.
- Real sign-up: the "ساخت حساب" tab still only validates and says it is not live.

## Before going live
Delete `src/lib/panel/demo.ts`, the `FEATURES.demoPanel` flag, the demo login branch in `LoginForm.tsx`, and the sample data seed in `panel.ts`. The hard-coded demo IDs and passwords must never reach production.
