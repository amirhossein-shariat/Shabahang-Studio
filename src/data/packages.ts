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
  /** One-time fee added to the total of this duration */
  setupFee: number;
  label: L;
};
export type PackagesConfig = {
  enabled: boolean;
  kicker: L; title: L; subtitle: L; footnote: L;
  currency: L; perMonth: L; durationTitle: L; totalLabel: L; setupIncluded: L; discountLabel: L; cta: L; included: L; notIncluded: L;
  plans: Plan[];
  durations: Duration[];
};

const f = (faL: string, enL: string, fa: string, en: string, off = false): Feature => ({ label: { fa: faL, en: enL }, value: { fa, en }, off });

export const INSTAGRAM_PACKAGES: PackagesConfig = {
  enabled: true,
  kicker: { fa: "اینستاگرام", en: "Instagram" },
  title: { fa: "پکیج‌های اینستاگرام", en: "Instagram packages" },
  subtitle: {
    fa: "سه سطح برای همراهی ماهانه. مدت قرارداد را انتخاب کنید تا قیمت‌ها با تخفیف محاسبه شود.",
    en: "Three levels of monthly support. Pick a contract length to see prices with the discount applied.",
  },
  footnote: {
    fa: "تخفیف روی قیمت ماهانه اعمال می‌شود و مبلغ کل برابر است با قیمت ماهانه ضرب در تعداد ماه (به‌علاوه‌ی هزینه‌ی راه‌اندازی، اگر برای آن مدت تعریف شده باشد).",
    en: "The discount applies to the monthly price, and the total is the monthly price times the number of months (plus the setup fee, where one applies to that length).",
  },
  currency: { fa: "میلیون تومان", en: "million toman" },
  perMonth: { fa: "ماهانه", en: "per month" },
  durationTitle: { fa: "مدت قرارداد", en: "Contract length" },
  totalLabel: { fa: "مبلغ کل", en: "Total" },
  setupIncluded: { fa: "شامل هزینه‌ی راه‌اندازی", en: "incl. setup fee" },
  discountLabel: { fa: "تخفیف", en: "off" },
  cta: { fa: "دریافت مشاوره‌ی این بسته", en: "Ask about this plan" },
  included: { fa: "شامل", en: "Included" },
  notIncluded: { fa: "شامل نمی‌شود", en: "Not included" },
  durations: [
    { id: "m1", enabled: true, months: 1, discountPercent: 0, setupFee: 3, label: { fa: "۱ ماهه", en: "1 month" } },
    { id: "m3", enabled: true, months: 3, discountPercent: 6, setupFee: 0, label: { fa: "۳ ماهه", en: "3 months" } },
    { id: "m6", enabled: true, months: 6, discountPercent: 12, setupFee: 0, label: { fa: "۶ ماهه", en: "6 months" } },
  ],
  plans: [
    {
      id: "bronze", enabled: true, tier: "bronze", name: { fa: "بسته برنزی", en: "Bronze plan" }, basePrice: 10,
      features: [
        f("استراتژی و تقویم محتوایی", "Strategy & content calendar", "ماهانه", "Monthly"),
        f("سناریو و شات‌لیست", "Scripts & shot lists", "۴ ریلز", "4 reels"),
        f("فیلمبرداری", "Filming", "ندارد (راهنمای فیلمبرداری با موبایل)", "None (phone filming guide included)", true),
        f("تدوین ریلز", "Reels editing", "۴ ریلز", "4 reels"),
        f("پست ثابت / کروسل", "Static / carousel posts", "۴ پست", "4 posts"),
        f("استوری", "Stories", "۸ استوری", "8 stories"),
        f("استوری موشن", "Motion stories", "ندارد", "None", true),
        f("کپشن و هشتگ", "Captions & hashtags", "همه محتوا", "All content"),
        f("هایلایت و کاور", "Highlights & covers", "۵ هایلایت (یک‌بار در شروع)", "5 highlights (one-time, at start)"),
        f("کامنت و دایرکت", "Comments & DMs", "ندارد", "None", true),
        f("گزارش", "Reporting", "ماهانه (مکتوب)", "Monthly (written)"),
        f("مشاوره و همراهی", "Advice & support", "پاسخ ظرف ۴۸ ساعت", "Reply within 48 hours"),
      ],
    },
    {
      id: "silver", enabled: true, tier: "silver", name: { fa: "بسته نقره‌ای", en: "Silver plan" }, basePrice: 20,
      badge: { fa: "پیشنهادی", en: "Recommended" },
      features: [
        f("استراتژی و تقویم محتوایی", "Strategy & content calendar", "ماهانه + بازبینی هفتگی", "Monthly + weekly review"),
        f("سناریو و شات‌لیست", "Scripts & shot lists", "۶ ریلز", "6 reels"),
        f("فیلمبرداری", "Filming", "۱ جلسه نیم‌روزه در کلینیک", "1 half-day session at the clinic"),
        f("تدوین ریلز", "Reels editing", "۶ ریلز", "6 reels"),
        f("پست ثابت / کروسل", "Static / carousel posts", "۶ پست", "6 posts"),
        f("استوری", "Stories", "۲۰ استوری", "20 stories"),
        f("استوری موشن", "Motion stories", "۲ استوری", "2 stories"),
        f("کپشن و هشتگ", "Captions & hashtags", "همه محتوا", "All content"),
        f("هایلایت و کاور", "Highlights & covers", "۵ هایلایت (بازبینی ماهانه)", "5 highlights (monthly review)"),
        f("کامنت و دایرکت", "Comments & DMs", "ساعات اداری (شنبه تا پنجشنبه، ۹ تا ۱۷)", "Office hours (Sat to Thu, 9 to 17)"),
        f("گزارش", "Reporting", "ماهانه + جلسه ۳۰ دقیقه‌ای", "Monthly + 30-minute meeting"),
        f("مشاوره و همراهی", "Advice & support", "پاسخ ظرف ۲۴ ساعت", "Reply within 24 hours"),
      ],
    },
    {
      id: "gold", enabled: true, tier: "gold", name: { fa: "بسته طلایی", en: "Gold plan" }, basePrice: 35,
      features: [
        f("استراتژی و تقویم محتوایی", "Strategy & content calendar", "ماهانه + تحلیل رقبا و ترند هفتگی", "Monthly + weekly competitor and trend analysis"),
        f("سناریو و شات‌لیست", "Scripts & shot lists", "۱۰ ریلز", "10 reels"),
        f("فیلمبرداری", "Filming", "۲ جلسه نیم‌روزه در کلینیک", "2 half-day sessions at the clinic"),
        f("تدوین ریلز", "Reels editing", "۱۰ ریلز", "10 reels"),
        f("پست ثابت / کروسل", "Static / carousel posts", "۸ پست", "8 posts"),
        f("استوری", "Stories", "۳۰ استوری (روزانه)", "30 stories (daily)"),
        f("استوری موشن", "Motion stories", "۴ استوری", "4 stories"),
        f("کپشن و هشتگ", "Captions & hashtags", "همه محتوا", "All content"),
        f("هایلایت و کاور", "Highlights & covers", "۸ هایلایت (بروزرسانی ماهانه)", "8 highlights (monthly update)"),
        f("کامنت و دایرکت", "Comments & DMs", "هر روز هفته، ۹ تا ۲۱", "Every day of the week, 9 to 21"),
        f("گزارش", "Reporting", "هر ۲ هفته + جلسه ماهانه", "Every 2 weeks + monthly meeting"),
        f("مشاوره و همراهی", "Advice & support", "پاسخ ظرف ۱۲ ساعت + جلسه مشاوره ماهانه", "Reply within 12 hours + monthly advice session"),
      ],
    },
  ],
};

const round = (n: number) => Math.round(n * 100) / 100;

/** Monthly and total price of a plan for a contract length. */
export function priceFor(plan: Plan, d: Duration) {
  const monthly = round(plan.basePrice * (1 - d.discountPercent / 100));
  const total = round(plan.basePrice * (1 - d.discountPercent / 100) * d.months + d.setupFee);
  return { monthly, total };
}
