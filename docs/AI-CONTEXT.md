# AI-CONTEXT — خواندن اول برای هر هوش مصنوعی یا برنامه‌نویسی که پروژه را ادامه می‌دهد

> این فایل و بقیه‌ی `docs/` یک «بکاپ کامل دانش پروژه» است. اگر این مخزن به ChatGPT، Claude یا هر ابزار دیگری وصل شد، ابتدا همین فایل را بخوان.
> زبان مالک: فارسی. با مالک فارسی و کوتاه حرف بزن؛ نام فایل‌ها و کد انگلیسی بماند. آخرین به‌روزرسانی: ۲۰۲۶-۱۱-۱۱.

## ۱. پروژه چیست
«شباهنگ استودیو» (Shabahang Studio): سایت دوزبانه (fa پیش‌فرض RTL، en) با تم تیره‌ی لوکس (آبی شبانه + طلایی) برای استودیوی طراحی + دیجیتال + IT. پنج ستون خدمت: برندینگ، طراحی سایت/اپ، شبکه‌های اجتماعی (اینستاگرام)، پشتیبانی IT و شبکه، طراحی محصول. به‌علاوه‌ی **پنل‌های نمایشی (دمو)** مشتری و مدیرعامل و ابزار فاکتور.
مخزن: `amirhossein-shariat/shabahang-studio`، شاخه‌ی کاری `claude/gifted-planck-f6ewz9`.

## ۲. قواعد دائمی مالک (نقض نشود)
فایل `CLAUDE.md` بخش ۰ — **حذف یا ویرایش نشود**: تصمیم‌ها با مقایسه‌ی نمونه‌های جهانی و ایرانی؛ سیو‌محور (پیش‌نویس خودکار، حذف نرم، سند وضعیت در پایان هر مرحله)؛ امنیت بسیار بالا؛ نام‌گذاری رایج فارسی؛ PWA فقط در برنامه (ساخته نشود)؛ **بدون سرویس پیامکی (نه OTP نه ورود با شماره)**؛ بدون محتوای ساختگی (نامعلوم = `[جای‌گذار]`).
قواعد افزوده‌ی مالک در گفت‌وگوها: هیچ افکت واکنش‌دهنده به ماوس/انگشت؛ هیچ letter-spacing روی متن فارسی؛ بعد از هر تغییر پیش‌نمایش دوباره منتشر شود؛ نیازمندی‌های قابل‌ویرایش ادمین در `docs/memory/` ثبت شود؛ قبل از کار با Next.js این نسخه (۱۶) `AGENTS.md` و `node_modules/next/dist/docs/` را بخوان.

## ۳. اجرا و ساخت
```bash
npm install
npm run dev        # توسعه
npm run lint && npm run build
```
Next.js 16 (App Router، `proxy.ts` به‌جای middleware، `PageProps<"/[lang]/...">` از انواع تولیدشده در build)، React 19، TypeScript، Tailwind v4 (utility در layer و CSS دستی بدون layer؛ container query با `@container` / `@xl:`).

## ۴. نقشه‌ی کد
- `src/app/[lang]/` — صفحه‌ها: `page` (خانه)، `services` (نمای کلی)، `services/[service]` (صفحه‌ی اختصاصی هر خدمت: brand, web, growth, it, product)، `about`, `contact`, `login`, `panel`، `work` (خاموش).
- `src/data/` — داده‌های قابل‌ویرایش (آینده: پنل ادمین): `services.ts` (۵ ستون و زیرخدمت‌ها)، `packages.ts` (پکیج‌های اینستاگرام)، `it.ts` (پکیج‌های IT، خدمات پروژه‌ای، تعرفه، شرایط قرارداد)، `faq.ts` (سوالات متداول هر خدمت)، `studio.ts` (لوگوی مشتریان `CLIENTS`).
- `src/dictionaries/` — متن‌های fa/en. `src/config.ts` — فلگ‌ها (`FEATURES.showWork=false`, `demoPanel`, `showLogin`).
- `src/components/` — `FaqCarousel`, `ItServices`, `InstagramPackages`, `ClientsMarquee`, `Header`, `PanelClient`, `Enhance`, ...
- `src/lib/enhance.ts` — بهبود تدریجی بدون فریم‌ورک: تعویض ماهانه/سه‌ماهه، کاروسل FAQ، نوار انتخاب خدمات پروژه‌ای، پیش‌پر شدن فرم تماس (`sessionStorage["sh-prefill"]`).
- `src/lib/panel/` — پنل‌ها (رندر رشته‌ای DOM): `panel.ts` (مشتری/مدیرعامل)، `invoices.ts` (ابزار فاکتور)، `jalali.ts` (تقویم شمسی دقیق)، `demo.ts` (ورود نمایشی: مشتری `2222`، مدیرعامل `1111`).
- `src/app/globals.css` — همه‌ی استایل دستی: حرکت، `pn-*` پنل، `.inv-*` برگه‌ی فاکتور A4 و چاپ، FAQ/IT.
- `public/clients/` — لوگوهای مشتریان (سفید روی شفاف؛ SVG یا PNG). `tools/build_preview.py` — ساخت پیش‌نمایش ایستا از خروجی `next build` (برای Artifact؛ نیاز به `node` و TypeScript از node_modules).

## ۵. وضعیت فعلی (کارهای انجام‌شده)
خانه، خدمات (نمای کلی + ۵ صفحه‌ی اختصاصی با FAQ کاروسلی)، IT کامل طبق `docs/it-services-brief.md`، اینستاگرام (پکیج‌ها)، تماس (mailto)، ورود/ثبت‌نام (UI)، پنل مشتری (پیشخوان جدید: خلاصه، آخرین ۳ اعلان، آخرین ۳ پیام، پرداخت بعدی)، پنل مدیرعامل، ابزار فاکتور (لیست کنار فرم، دفترچه مخاطبین، پیش‌نویس خودکار، حذف نرم، وضعیت پرداخت، PDF)، لوگوهای مشتریان (۹ لوگو؛ دو مورد هنوز بی‌نام).
جزئیات: `docs/memory/project-state.md`، `panels-status.md`، `admin-panel.md`، `auth-and-panels.md`، `docs/shabahang-panels-spec.md`، `docs/shabahang-studio-handoff.md`، `docs/invoice-website-brief.md`، `docs/it-services-brief.md`، `docs/shabahang-studio-brief.md`.

## ۶. هنوز باز / نیازمند تصمیم مالک
- **قیمت‌ها و جزئیات IT**: قیمت دو پکیج، ساعت پشتیبانی، شهرهای حضوری، مالیات (VAT)، مسیر تماس، بازه‌ی تست بکاپ، ارزیابی رایگان (فهرست ۱۱ در `docs/it-services-brief.md`).
- نام دو مشتری جدید (لوگوی R آبی/قرمز و D آبی) و املای «Pratti»؛ در `src/data/studio.ts` فعلاً `[نام مشتری ۱]` و `[نام مشتری ۲]`.
- محتوای IT فقط فارسی است (`/en` همان را نشان می‌دهد).
- بک‌اند واقعی وجود ندارد: ورود، ذخیره‌ی فاکتور و پنل‌ها فقط نمایشی‌اند (sessionStorage/localStorage). ایمیل تماس mailto است.
- پنل ادمین برای ویرایش FAQ/قیمت‌ها ساخته نشده (فعلاً ویرایش فایل‌های `src/data/*`).
- PWA (manifest/service worker) عمداً ساخته نشده. دامنه‌ی `shabahangstudio.ir` ثبت نشده. لوگوی نهایی استودیو، بخش تیم `/about`، لینک بله.
- بعدی که مالک گفته: ادامه‌ی پنل‌ها (پیشخوان مدیرعامل، بخش‌های دیگر).

## ۷. نکات فنی که زمان می‌برند
- Tailwind: utility در layer است و CSS دستی بیرون layer؛ برای override گاهی `!important` لازم است.
- روی `main` از `animation-fill-mode: backwards` استفاده می‌شود (وگرنه `position:fixed` فرزندان خراب می‌شود).
- ظهور با اسکرول: IntersectionObserver (نه `animation-timeline`).
- فاکتور: PDF ابتدا `window.print()`؛ اگر بلاک شد، فایل PDF تصویری ساخته و دانلود می‌شود. در Artifact پیش‌نمایش Claude چاپ/دانلود بسته است.
- لوگوها: سفید روی شفاف (SVG با ماسک یا PNG سفید با آلفا)؛ `opacity-95` در `ClientsMarquee.tsx`.
- `git push` مستقیم اکنون کار می‌کند (remote با پروکسی)؛ قبلاً فقط MCP متنی بود.
