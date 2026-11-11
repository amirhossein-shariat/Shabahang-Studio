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

## Round 2 (2026-11-10) — owner's review notes, implemented in the demo
- آموزش is now a spotlight tour: each step dims the page and rings the real tab (پیشخوان، پروژه‌ها، پیام‌ها، امور مالی، سفارش جدید) with a tooltip next to it.
- Chat: Enter sends, Shift+Enter new line; Telegram-style vector buttons (attach paperclip, mic that becomes the send plane once text exists); drafts autosave.
- People are shown as name first, then a role chip in a different colour (مدیرعامل gold, طراح گرافیک violet, مشتری grey). Names are placeholders `آقا/خانم [نام …]`.
- CEO messages: three tabs: گفت‌وگو با مجریان, گفت‌وگو با مشتریان, نظارت (read-only view of every executor-client chat).
- امور مالی: one box per invoice with its own details, a «مشاهده‌ی فاکتور» modal, payment terms (نقدی / قسطی / چکی / اعتباری) set by the CEO per invoice and changeable later, allowed payment methods per invoice (کارت‌به‌کارت، پل، …), «پرداخت» button (choose method, tracking number, receipt photo). The CEO also picks the destination account per invoice.
- Bank accounts: CEO page «کارت‌ها و حساب‌های بانکی» (several cards with holder, bank, card number, sheba, active flag, default for the demo customer). Account details appear only where needed (payment form, top reference card) with copy buttons.
- Projects: new timeline (horizontal on wide screens, vertical on phones) and an accurate Jalali content calendar: month navigation, weekday header (شنبه … جمعه), real weekday per date (algorithm checked against Intl for every day 1990–2070, zero mismatches), selected day shown as "یکشنبه ۱۷ آبان", items with kind and white/grey detail, and a comment box on each item (client comments go to the executor; the CEO sees everything and can reply).
- Not done yet: invoice creation, real attachments upload, executor panel (comments are stored, no executor UI).

## Invoice tool (2026-11-10)
CEO nav «فاکتورها» opens the owner's invoice tool (spec: `docs/invoice-website-brief.md`): form with Jalali date picker, live A4 preview with one-page fit, PDF through the browser (title `فاکتور-<number>-<customer>`), saved list with search / name filter / unpaid summary / paid checkbox / copy / soft delete, phone book, settings dialog, drag and drop, Ctrl+S and Ctrl+P, draft autosave. It is separate from the client-facing demo invoices (the old nav item is now «رسیدها و پرداخت‌ها»). Data lives in localStorage until the backend exists.

## NOT built (per spec, do not build without the owner)
- Real backend: Node server, PostgreSQL, S3 storage, SMTP, real auth (email verification → admin approval, TOTP, lockout, CSRF, hashed passwords), server-side access control, real audit log. All of this needs the hosting decision (spec section 12: Liara PaaS + managed DB + S3 suggested; prices unchecked).
- Executor (staff) panel: waiting for the owner's answers to the 3 questions in spec section 8.
- Admin-only panel: waiting for the owner's invoice-format md file; package editing, invoice and instalment builder, stage templates are not built.
- CEO finance section: owner completes it himself; the task must not be closed (spec section 10).
- Telegram admin alerts, e-mail notifications, PWA (only registered in the plan; manifest / service worker intentionally not built), online payment gateway.
- Real sign-up: the "ساخت حساب" tab still only validates and says it is not live.

## Before going live
Delete `src/lib/panel/demo.ts`, the `FEATURES.demoPanel` flag, the demo login branch in `LoginForm.tsx`, and the sample data seed in `panel.ts`. The hard-coded demo IDs and passwords must never reach production.

## پیشخوان مشتری (به‌روز: ۲۰۲۶-۱۱-۱۰)
- «در انتظار اقدام شما» حذف شد. اضافه شد: ۴ کارت خلاصه (پروژه‌ی در حال انجام، پکیج فعال، پرداخت باز، پیام خوانده‌نشده)، آخرین ۳ اعلان، آخرین ۳ پیام (با نام و نقش فرستنده، ساعت، شمارنده‌ی خوانده‌نشده؛ کلیک = باز شدن همان گفت‌وگو)، پکیج‌های فعال، پروژه‌ها، پرداخت بعدی، میانبرها.
- منتظر تغییرات بعدی مالک.

## ابزار فاکتور — ظاهر جدید (۲۰۲۶-۱۱-۱۰)
- طبق تصویر مالک: لیست فاکتورها بدون باکس کنار فرم (فیلتر «اسم‌ها» + جستجو؛ کارت‌ها با نوار رنگی سبز=پرداخت‌شده/قرمز=پرداخت‌نشده و تیک وضعیت)؛ پیش‌نمایش حذف شد؛ باکس «فاکتورهای ذخیره‌شده» حذف شد. نام مشتری = ورودی با دفترچه‌ی مخاطبین (انتخاب ← پر شدن خودکار تلفن).
- فرم: عنوان، نام/تلفن، تاریخ، جدول اقلام (#، شرح، تعداد، فی)، + افزودن ردیف، تخفیف، جمع کل/قابل پرداخت، یادداشت، دکمه‌های ذخیره (سبز) و PDF.
- PDF: ابتدا دیالوگ چاپ مرورگر؛ اگر بلاک شد (مثلاً iframe سندباکس) خودکار فایل `invoice-XXXX.pdf` ساخته و دانلود می‌شود (رندر صفحه به تصویر، بدون کتابخانه). متن فایل دانلودی تصویری است (انتخاب‌پذیر نیست)؛ دیالوگ چاپ متن واقعی می‌دهد.
