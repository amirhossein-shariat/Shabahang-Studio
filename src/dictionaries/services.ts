import type { Locale } from "./index";

export type Row = { group?: string; label: string; v: [string, string, string] };
export type Pkg = { title: string; sub: string; levels: [string, string, string]; rows: Row[]; priceNote: string };

export type ServicesDict = {
  meta: { title: string; description: string };
  hero: { kicker: string; title: string; desc: string };
  price: string;
  projects: { title: string; sub: string; items: { name: string; line: string; points: string[]; note?: string }[] };
  it: Pkg & { basis: string; setup: string };
  web: { title: string; sub: string; free: string[]; paid: string[]; freeTitle: string; paidTitle: string; plans: string; domain: string };
  starters: { title: string; items: { name: string; text: string }[] };
  cta: { title: string; button: string };
  back: string;
};

const fa: ServicesDict = {
  meta: { title: "خدمات و پکیج‌ها | شباهنگ استودیو", description: "پنج ستون خدمات شباهنگ استودیو و پکیج‌های ماهانه‌ی محتوا و رشد و IT." },
  hero: { kicker: "خدمات و پکیج‌ها", title: "هر چیزی که برندت برای بیدار ماندن لازم دارد", desc: "کارهای پروژه‌ای یک‌بار قیمت می‌خورند و خدمات مستمر به‌صورت پکیج ماهانه ارائه می‌شوند. قیمت‌ها پس از جلسه‌ی اول و بر اساس نیاز شما اعلام می‌شود." },
  price: "[قیمت]",
  projects: {
    title: "کارهای پروژه‌ای",
    sub: "قیمت هر پروژه با توجه به دامنه‌ی کار تعیین می‌شود.",
    items: [
      { name: "برند و هویت", line: "به کسب‌وکارت یک چهره بده", points: ["لوگو و هویت بصری", "کاتالوگ", "بسته‌بندی گرافیکی", "موشن لوگو"] },
      { name: "طراحی محصول", line: "ایده‌ات رو محصول کن", points: ["طراحی صنعتی", "مدل‌سازی و رندر", "نمونه‌سازی و پرینت سه‌بعدی"] },
    ],
  },
  it: {
    title: "IT و زیرساخت",
    sub: "سیستم‌هات همیشه سالم و روشن بمونن. قرارداد ماهانه با سه سطح.",
    levels: ["برنزی", "نقره‌ای", "طلایی"],
    priceNote: "قیمت ماهانه به‌ازای هر کاربر",
    basis: "قیمت بر اساس تعداد کاربر محاسبه می‌شود.",
    rows: [
      { label: "پشتیبانی کاربران", v: ["تلفنی و از راه دور", "+ ویزیت حضوری دوره‌ای", "حضوری با اولویت و زمان پاسخ تضمینی"] },
      { label: "مانیتورینگ شبکه و سیستم‌ها", v: ["بررسی ماهانه", "بررسی هفتگی", "مداوم"] },
      { label: "بکاپ‌گیری", v: ["نظارت بر بکاپ", "+ تست بازیابی", "+ طراحی و مدیریت کامل"] },
      { label: "مصرف اینترنت", v: ["—", "گزارش ماهانه", "گزارش + بهینه‌سازی"] },
      { label: "VoIP", v: ["—", "پشتیبانی", "مدیریت و تنظیم داخلی‌ها"] },
      { label: "نگهداری زیرساخت", v: ["—", "✓", "✓ + برنامه‌ریزی ارتقا"] },
      { label: "گزارش", v: ["ساده", "ماهانه", "ماهانه + جلسه"] },
    ],
    setup: "راه‌اندازی اولیه (شبکه‌کشی، سرور، VoIP) پروژه‌ای است و جدا قیمت می‌خورد.",
  },
  web: {
    title: "سایت و نرم‌افزار",
    sub: "آنلاین شو. قیمت پروژه بر اساس نوع کار: سایت معرفی، سایت فروشگاهی، اپ یا پنل سفارشی.",
    freeTitle: "۳ ماه پشتیبانی رایگان (داخل قیمت پروژه)",
    free: ["رفع باگ", "آپدیت امنیتی", "بکاپ", "تغییرات کوچک تا سقف مشخص"],
    paidTitle: "جدا قیمت می‌خورد",
    paid: ["امکان یا صفحه‌ی جدید", "دامنه و هاست (سالانه)"],
    plans: "بعد از ۳ ماه: پشتیبانی ماهانه‌ی پایه یا حرفه‌ای که در ساعت تغییرات و سرعت پاسخ فرق دارند. رفع باگ همیشه رایگان است.",
    domain: "",
  },
  starters: {
    title: "پیشنهادهای آماده",
    items: [
      { name: "راه‌اندازی کلینیک و مطب", text: "لوگو + سایت ساده با نوبت‌دهی + پکیج نقره‌ای محتوا و رشد." },
      { name: "شرکت‌های صنعتی و تاسیساتی", text: "کاتالوگ و عکس محصول + سایت شرکتی با ۳ ماه پشتیبانی رایگان + IT نقره‌ای." },
    ],
  },
  cta: { title: "نمی‌دانی کدام پکیج به کارت می‌آید؟", button: "گفتگو با ما" },
  back: "بازگشت به خانه",
};

const en: ServicesDict = {
  meta: { title: "Services & Packages | Shabahang Studio", description: "Shabahang Studio's five service pillars, with monthly Content & Growth and IT packages." },
  hero: { kicker: "Services & Packages", title: "Everything a brand needs to stay awake", desc: "Projects are priced once; ongoing work runs as monthly packages. Prices are shared after a first call, based on what you need." },
  price: "[price]",
  projects: {
    title: "Project work",
    sub: "Each project is priced by scope.",
    items: [
      { name: "Brand", line: "Give your business a face.", points: ["Logo and visual identity", "Catalogue", "Packaging graphics", "Logo motion"] },
      { name: "Product Design", line: "Turn your idea into a product.", points: ["Industrial design", "Modelling and rendering", "Prototyping and 3D printing"] },
    ],
  },
  it: {
    title: "IT & Infrastructure",
    sub: "Keep your systems healthy and on. A monthly contract in three levels.",
    levels: ["Bronze", "Silver", "Gold"],
    priceNote: "Monthly price per user",
    basis: "Pricing is based on the number of users.",
    rows: [
      { label: "User support", v: ["Phone and remote", "+ periodic on-site visits", "On-site, priority, guaranteed response time"] },
      { label: "Network and system monitoring", v: ["Monthly check", "Weekly check", "Continuous"] },
      { label: "Backups", v: ["Backup oversight", "+ restore tests", "+ full design and management"] },
      { label: "Internet usage", v: ["—", "Monthly report", "Report + optimisation"] },
      { label: "VoIP", v: ["—", "Support", "Management and extension setup"] },
      { label: "Infrastructure upkeep", v: ["—", "✓", "✓ + upgrade planning"] },
      { label: "Report", v: ["Simple", "Monthly", "Monthly + meeting"] },
    ],
    setup: "Initial setup (cabling, servers, VoIP) is a separate project with its own price.",
  },
  web: {
    title: "Web & Software",
    sub: "Get online. Project price depends on the type: company site, online store, custom app or panel.",
    freeTitle: "3 months of free support (included in the project price)",
    free: ["Bug fixes", "Security updates", "Backups", "Small changes up to a set limit"],
    paidTitle: "Priced separately",
    paid: ["A new feature or page", "Domain and hosting (yearly)"],
    plans: "After 3 months: monthly Basic or Pro support, which differ in change hours and response speed. Bug fixes are always free.",
    domain: "",
  },
  starters: {
    title: "Ready-made offers",
    items: [
      { name: "Clinic launch", text: "Logo + simple site with booking + Silver Content & Growth package." },
      { name: "Industrial and HVAC companies", text: "Catalogue and product photos + company site with 3 months of free support + Silver IT." },
    ],
  },
  cta: { title: "Not sure which package fits?", button: "Talk to us" },
  back: "Back to home",
};

export const getServicesDict = (l: Locale) => (l === "fa" ? fa : en);
