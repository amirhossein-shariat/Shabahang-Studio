/**
 * Instagram / Content & Growth packages. Everything the page shows lives here so an admin panel can
 * later read and write this one object: titles, texts, prices, discounts, cards, rows, durations.
 * Prices are in `currency` units (million toman). Monthly and total prices are always computed from
 * `basePrice`, the duration's `discountPercent` and `setupFee`; never typed by hand.
 */
export type L = { fa: string; en: string };
export type Feature = { label: L; value: L; /** true = not included in this plan (shown muted) */ off?: boolean };
export type Plan = {
  id: string;
  enabled: boolean;
  tier: "bronze" | "silver" | "gold";
  name: L;
  /** Monthly price before any discount */
  basePrice: number;
  badge?: L;
  features: Feature[];
};
export type Duration = {
  id: string;
  enabled: boolean;
  months: number;
  discountPercent: number;
  /** Selected when the page opens (exactly one duration should have this) */
  default?: boolean;
  /** One-time fee added to the total of this duration */
  setupFee: number;
  label: L;
};
export type Terms = {
  paymentTitle: L;
  payment: { when: L; text: L }[];
  /** One-time setup fee in `currency` units. NOT part of the totals; waived when a duration has setupFee 0 */
  setupAmount: number;
  setup: L; setupFree: L; setupTime: L; setupIncludes: L;
  notes: L[];
  validity: L;
};
export type PackagesConfig = {
  enabled: boolean;
  kicker: L; title: L; subtitle: L; footnote: L;
  currency: L; durationTitle: L; monthlyLabel: L; setupIncluded: L; discountLabel: L; cta: L; included: L; notIncluded: L;
  plans: Plan[];
  durations: Duration[];
  /** Payment terms, setup, notes: shown under the cards and on the printable price list */
  terms: Terms;
};

const f = (faL: string, enL: string, fa: string, en: string, off = false): Feature => ({ label: { fa: faL, en: enL }, value: { fa, en }, off });

export const INSTAGRAM_PACKAGES: PackagesConfig = {
  enabled: true,
  kicker: { fa: "اینستاگرام", en: "Instagram" },
  title: { fa: "پکیج‌های اینستاگرام", en: "Instagram packages" },
  subtitle: {
    fa: "سه سطح برای همراهی ماهانه. مدت قرارداد را انتخاب کنید تا مبلغ کل همان دوره، با تخفیف، نمایش داده شود.",
    en: "Three levels of monthly support. Pick a contract length to see the total for that whole period, discount included.",
  },
  footnote: {
    fa: "",
    en: "",
  },
  currency: { fa: "میلیون تومان", en: "million toman" },
  durationTitle: { fa: "مدت قرارداد", en: "Contract length" },
  monthlyLabel: { fa: "معادل ماهانه", en: "Monthly equivalent" },
  setupIncluded: { fa: "به‌علاوه‌ی هزینه‌ی راه‌اندازی", en: "plus one-time setup fee" },
  discountLabel: { fa: "تخفیف", en: "off" },
  cta: { fa: "دریافت مشاوره‌ی این بسته", en: "Ask about this plan" },
  included: { fa: "شامل", en: "Included" },
  notIncluded: { fa: "شامل نمی‌شود", en: "Not included" },
  durations: [
    { id: "m1", enabled: true, months: 1, discountPercent: 0, setupFee: 4, label: { fa: "۱ ماهه", en: "1 month" } },
    { id: "m3", enabled: true, default: true, months: 3, discountPercent: 6, setupFee: 4, label: { fa: "۳ ماهه", en: "3 months" } },
    { id: "m6", enabled: true, months: 6, discountPercent: 12, setupFee: 0, label: { fa: "۶ ماهه", en: "6 months" } },
  ],
  plans: [
    {
      id: "bronze", enabled: true, tier: "bronze", name: { fa: "بسته برنزی", en: "Bronze plan" }, basePrice: 18,
      features: [
        f("استراتژی و تقویم محتوایی", "Strategy & content calendar", "تقویم ماهانه", "Monthly calendar"),
        f("سناریو و شات‌لیست (ماهانه)", "Scripts & shot lists (monthly)", "۴ ریلز", "4 reels"),
        f("فیلمبرداری", "Filming", "ندارد (راهنمای فیلمبرداری با موبایل)", "None (phone filming guide included)", true),
        f("تدوین ریلز (ماهانه)", "Reels editing (monthly)", "۴ ریلز", "4 reels"),
        f("پست ثابت / کاروسل (ماهانه)", "Static / carousel posts (monthly)", "۴ پست", "4 posts"),
        f("استوری (ماهانه)", "Stories (monthly)", "۸ استوری", "8 stories"),
        f("استوری موشن (ماهانه)", "Motion stories (monthly)", "ندارد", "None", true),
        f("کپشن و هشتگ", "Captions & hashtags", "همه‌ی محتواها", "All content"),
        f("هایلایت و کاور", "Highlights & covers", "۵ هایلایت (یک‌بار در شروع)", "5 highlights (one-time, at start)"),
        f("پاسخ‌های آماده (سؤالات پرتکرار)", "Ready replies (FAQ)", "ندارد", "None", true),
        f("اصلاحات", "Revisions", "۲ نوبت برای هر محتوا", "2 rounds per piece"),
        f("گزارش", "Reporting", "ماهانه (مکتوب)", "Monthly (written)"),
      ],
    },
    {
      id: "silver", enabled: true, tier: "silver", name: { fa: "بسته نقره‌ای", en: "Silver plan" }, basePrice: 29,
      badge: { fa: "پیشنهادی", en: "Recommended" },
      features: [
        f("استراتژی و تقویم محتوایی", "Strategy & content calendar", "ماهانه + بازبینی هفتگی", "Monthly + weekly review"),
        f("سناریو و شات‌لیست (ماهانه)", "Scripts & shot lists (monthly)", "۶ ریلز", "6 reels"),
        f("فیلمبرداری", "Filming", "۱ جلسه (تا ۴ ساعت) در محل کسب‌وکار شما", "1 session (up to 4 hours) at your business"),
        f("تدوین ریلز (ماهانه)", "Reels editing (monthly)", "۶ ریلز", "6 reels"),
        f("پست ثابت / کاروسل (ماهانه)", "Static / carousel posts (monthly)", "۶ پست", "6 posts"),
        f("استوری (ماهانه)", "Stories (monthly)", "۱۵ استوری", "15 stories"),
        f("استوری موشن (ماهانه)", "Motion stories (monthly)", "۲ استوری", "2 stories"),
        f("کپشن و هشتگ", "Captions & hashtags", "همه‌ی محتواها", "All content"),
        f("هایلایت و کاور", "Highlights & covers", "۵ هایلایت (بازبینی ماهانه)", "5 highlights (monthly review)"),
        f("پاسخ‌های آماده (سؤالات پرتکرار)", "Ready replies (FAQ)", "تا ۱۵ پاسخ (یک‌بار در شروع)", "Up to 15 replies (one-time, at start)"),
        f("اصلاحات", "Revisions", "۲ نوبت برای هر محتوا", "2 rounds per piece"),
        f("گزارش", "Reporting", "ماهانه + جلسه‌ی ۳۰ دقیقه‌ای", "Monthly + 30-minute meeting"),
      ],
    },
    {
      id: "gold", enabled: true, tier: "gold", name: { fa: "بسته طلایی", en: "Gold plan" }, basePrice: 40,
      features: [
        f("استراتژی و تقویم محتوایی", "Strategy & content calendar", "ماهانه + تحلیل رقبا و ترند هفتگی", "Monthly + weekly competitor and trend analysis"),
        f("سناریو و شات‌لیست (ماهانه)", "Scripts & shot lists (monthly)", "۱۰ ریلز", "10 reels"),
        f("فیلمبرداری", "Filming", "۲ جلسه (هر کدام تا ۴ ساعت) در محل کسب‌وکار شما", "2 sessions (up to 4 hours each) at your business"),
        f("تدوین ریلز (ماهانه)", "Reels editing (monthly)", "۱۰ ریلز", "10 reels"),
        f("پست ثابت / کاروسل (ماهانه)", "Static / carousel posts (monthly)", "۸ پست", "8 posts"),
        f("استوری (ماهانه)", "Stories (monthly)", "۲۵ استوری", "25 stories"),
        f("استوری موشن (ماهانه)", "Motion stories (monthly)", "۴ استوری", "4 stories"),
        f("کپشن و هشتگ", "Captions & hashtags", "همه‌ی محتواها", "All content"),
        f("هایلایت و کاور", "Highlights & covers", "۸ هایلایت (به‌روزرسانی ماهانه)", "8 highlights (monthly update)"),
        f("پاسخ‌های آماده (سؤالات پرتکرار)", "Ready replies (FAQ)", "تا ۲۵ پاسخ + به‌روزرسانی ماهانه", "Up to 25 replies + monthly update"),
        f("اصلاحات", "Revisions", "۲ نوبت برای هر محتوا", "2 rounds per piece"),
        f("گزارش", "Reporting", "هر ۲ هفته + جلسه‌ی ماهانه", "Every 2 weeks + monthly meeting"),
      ],
    },
  ],
  terms: {
    paymentTitle: { fa: "شرایط پرداخت", en: "Payment terms" },
    payment: [
      { when: { fa: "۱ ماهه", en: "1 month" }, text: { fa: "تسویه‌ی کامل در شروع همکاری", en: "Full payment at the start" } },
      { when: { fa: "۳ و ۶ ماهه", en: "3 and 6 months" }, text: { fa: "۵۰٪ در شروع همکاری و ۵۰٪ در ابتدای ماه دوم", en: "50% at the start and 50% at the beginning of month 2" } },
    ],
    setupAmount: 4,
    setup: { fa: "هزینه‌ی راه‌اندازی", en: "Setup fee" },
    setupFree: { fa: "فقط یک‌بار در شروع همکاری؛ در قرارداد ۶ ماهه رایگان", en: "One-time, at the start; free on a 6-month contract" },
    setupTime: {
      fa: "حدود ۵ روز کاری پس از دریافت اطلاعات و پاسخ پرسشنامه (پاسخ‌های آماده‌ی نقره‌ای و طلایی هم در همین بازه آماده می‌شود)؛ انتشار محتوا بعد از آن شروع می‌شود.",
      en: "About 5 working days after we receive your information and the questionnaire (the ready replies of Silver and Gold are prepared in the same window); publishing starts after that.",
    },
    setupIncludes: {
      fa: "بررسی کسب‌وکار و رقبای اصلی · تنظیم پروفایل پیج (نام، بیو، لینک و دکمه‌های تماس) · طراحی قالب‌های اختصاصی پست، استوری و کاور ریلز · طراحی کاور هایلایت‌ها · تعیین ستون‌های محتوایی و لحن پیج. اگر پیج از قبل هویت بصری آماده داشته باشد، فقط بخش‌های لازم انجام و هزینه به همان نسبت کم می‌شود.",
      en: "Review of your business and main competitors · page profile setup (name, bio, link and contact buttons) · custom post, story and reel-cover templates · highlight covers · content pillars and tone of voice. If the page already has a visual identity, only the needed parts are done and the fee is reduced accordingly.",
    },
    notes: [
      { fa: "در پکیج‌های شامل فیلمبرداری، از دوربین iPhone 16، گیمبال و میکروفن استفاده می‌شود و تجهیزات نورپردازی در صورت نیاز به کار گرفته می‌شود.", en: "Packages with filming use an iPhone 16, a gimbal and a microphone; lighting equipment is added when needed." },
      { fa: "بودجه‌ی تبلیغات، فیلمبرداری خارج از شهر و محتوای بیش از سقف پکیج جداگانه محاسبه می‌شود.", en: "Ad budget, filming outside the city and content beyond the package limit are charged separately." },
      { fa: "هر کاروسل ۳ تا ۶ اسلاید یک پست حساب می‌شود.", en: "A carousel of 3 to 6 slides counts as one post." },
      { fa: "پاسخ‌گویی به کامنت و دایرکت با خود کسب‌وکار است و جزو پکیج‌ها نیست.", en: "Replying to comments and DMs is handled by the business itself and is not part of the packages." },
    ],
    validity: { fa: "قیمت‌ها تا پایان سال ۱۴۰۵ معتبر است.", en: "Prices are valid until the end of 1405 (Solar Hijri)." },
  },
};

const round = (n: number) => Math.round(n * 100) / 100;

/** Monthly and total price of a plan for a contract length. */
export function priceFor(plan: Plan, d: Duration) {
  const monthly = round(plan.basePrice * (1 - d.discountPercent / 100));
  /** Setup fee is separate (see `terms`), never part of the total. Totals are rounded to 0.1 million toman as in the final price list. */
  const total = Math.round(plan.basePrice * (1 - d.discountPercent / 100) * d.months * 10) / 10;
  return { monthly, total };
}
