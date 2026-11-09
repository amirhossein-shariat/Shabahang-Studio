/**
 * The five service pillars and the sub-services inside each. One source for the home cards,
 * the services page, the contact topic list and (later) the admin panel.
 * Names follow how clients search for the work (see docs/memory/naming-research.md).
 */
import type { IconName } from "@/components/ServiceIcon";

export type L = { fa: string; en: string };
export type Sub = { icon: IconName; name: L; text: L };
export type PillarId = "brand" | "web" | "growth" | "it" | "product";
export type Pillar = {
  id: PillarId;
  enabled: boolean;
  icon: IconName;
  name: L;
  line: L;
  /** Home card text */
  summary: L;
  /** How the work is bought */
  model: L;
  intro: L;
  subs: Sub[];
};

const s = (icon: IconName, faN: string, enN: string, faT: string, enT: string): Sub => ({ icon, name: { fa: faN, en: enN }, text: { fa: faT, en: enT } });

export const PILLARS: Pillar[] = [
  {
    id: "brand", enabled: true, icon: "pen",
    name: { fa: "برندینگ و هویت بصری", en: "Branding & Visual Identity" },
    line: { fa: "به کسب‌وکارت یک چهره بده", en: "Give your business a face." },
    summary: { fa: "لوگو، هویت بصری، کاتالوگ، بسته‌بندی گرافیکی و موشن لوگو.", en: "Logo, visual identity, catalogues, packaging graphics and logo motion." },
    model: { fa: "پروژه‌ای", en: "Project" },
    intro: { fa: "از نشان تا همه‌ی چیزهایی که مشتری از برند شما می‌بیند، با یک زبان بصری یک‌دست.", en: "From the mark to everything customers see of your brand, in one consistent visual language." },
    subs: [
      s("pen", "لوگو و هویت بصری", "Logo & visual identity", "نشان، رنگ‌ها و فونت‌ها برای اینکه برندتان در همه‌جا یکی دیده شود.", "Mark, colours and type so your brand looks the same everywhere."),
      s("book", "کاتالوگ و مواد چاپی", "Catalogues & print", "کاتالوگ محصول و مواد چاپی با هویت برند.", "Product catalogues and printed material in your brand identity."),
      s("box", "بسته‌بندی گرافیکی", "Packaging graphics", "طراحی گرافیک بسته‌بندی محصول.", "Graphic design for product packaging."),
      s("play", "موشن لوگو", "Logo motion", "حرکت دادن نشان برای ویدیو و شبکه‌های اجتماعی.", "Animating the mark for video and social media."),
    ],
  },
  {
    id: "web", enabled: true, icon: "globe",
    name: { fa: "طراحی سایت و اپلیکیشن", en: "Web & App Development" },
    line: { fa: "آنلاین شو", en: "Get online." },
    summary: { fa: "سایت معرفی، فروشگاهی و پنل سفارشی، با ۳ ماه پشتیبانی رایگان.", en: "Company sites, online stores and custom panels, with 3 months of free support." },
    model: { fa: "پروژه‌ای + ۳ ماه پشتیبانی رایگان", en: "Project + 3 months of free support" },
    intro: { fa: "قیمت بر اساس نوع کار تعیین می‌شود. بعد از تحویل، ۳ ماه پشتیبانی رایگان در قیمت پروژه است.", en: "Priced by the type of work. After handover, 3 months of free support are included in the project price." },
    subs: [
      s("globe", "سایت معرفی و شرکتی", "Company & presentation sites", "سایت برای معرفی کسب‌وکار، خدمات و راه‌های ارتباطی.", "A site that presents your business, services and contact options."),
      s("bag", "سایت فروشگاهی", "Online stores", "فروش آنلاین محصولات با سبد خرید و پرداخت.", "Selling products online with a cart and payments."),
      s("layers", "اپ و پنل سفارشی", "Custom apps & panels", "نرم‌افزار و پنل مدیریتی مطابق فرایند کار شما.", "Software and admin panels built around how you work."),
      s("headset", "پشتیبانی بعد از تحویل", "Support after launch", "۳ ماه رایگان؛ بعد از آن پشتیبانی ماهانه‌ی پایه یا حرفه‌ای.", "3 months free; after that a monthly Basic or Pro plan."),
    ],
  },
  {
    id: "growth", enabled: true, icon: "camera",
    name: { fa: "شبکه‌های اجتماعی و محتوا", en: "Social Media & Content" },
    line: { fa: "دیده شو", en: "Get seen." },
    summary: { fa: "مدیریت اینستاگرام، ریلز، طراحی و تولید محتوا با پکیج ماهانه.", en: "Instagram management, reels, design and content production in monthly packages." },
    model: { fa: "پکیج ماهانه", en: "Monthly package" },
    intro: { fa: "همراهی ماهانه برای اینکه پیج شما برنامه‌ی مشخص و محتوای حرفه‌ای داشته باشد. پکیج‌ها را در پایین ببینید.", en: "Monthly support so your page has a clear plan and professional content. See the packages below." },
    subs: [
      s("calendar", "استراتژی و تقویم محتوا", "Strategy & content calendar", "برنامه‌ی ماهانه‌ی محتوا و بازبینی دوره‌ای.", "A monthly content plan with regular reviews."),
      s("film", "ریلز: سناریو، فیلمبرداری و تدوین", "Reels: script, filming, editing", "از شات‌لیست تا ریلز آماده‌ی انتشار.", "From shot list to a reel ready to post."),
      s("image", "پست، کروسل و استوری", "Posts, carousels & stories", "طراحی پست ثابت، کروسل، استوری و استوری موشن.", "Static posts, carousels, stories and motion stories."),
      s("text", "کپشن، هشتگ و هایلایت", "Captions, hashtags & highlights", "متن همه‌ی محتوا و طراحی هایلایت و کاور.", "Copy for all content, plus highlight and cover design."),
      s("headset", "کامنت و دایرکت", "Comments & DMs", "پاسخ‌گویی در ساعت‌های مشخص، بسته به پکیج.", "Replies during set hours, depending on the plan."),
      s("activity", "گزارش و مشاوره", "Reports & advice", "گزارش دوره‌ای و جلسه‌ی مشاوره با مدیر اکانت.", "Periodic reports and advice sessions."),
    ],
  },
  {
    id: "it", enabled: true, icon: "server",
    name: { fa: "پشتیبانی IT و شبکه", en: "IT Support & Networks" },
    line: { fa: "سیستم‌هات همیشه سالم و روشن بمونن", en: "Keep your systems healthy and on." },
    summary: { fa: "پشتیبانی کاربران، مانیتورینگ، بکاپ و VoIP با قرارداد ماهانه.", en: "User support, monitoring, backups and VoIP on a monthly contract." },
    model: { fa: "قرارداد ماهانه", en: "Monthly contract" },
    intro: { fa: "قیمت بر اساس تعداد کاربر است. راه‌اندازی اولیه (شبکه‌کشی، سرور، VoIP) پروژه‌ای و جدا قیمت می‌خورد.", en: "Priced per user. Initial setup (cabling, servers, VoIP) is a separate project." },
    subs: [
      s("users", "پشتیبانی کاربران", "User support", "تلفنی، از راه دور و حضوری، بسته به سطح قرارداد.", "By phone, remote and on-site, depending on the plan."),
      s("activity", "مانیتورینگ شبکه و سیستم‌ها", "Network & system monitoring", "بررسی دوره‌ای یا مداوم سلامت شبکه و سیستم‌ها.", "Periodic or continuous checks of network and system health."),
      s("database", "بکاپ‌گیری و بازیابی", "Backups & recovery", "نظارت بر بکاپ، تست بازیابی و مدیریت کامل.", "Backup oversight, restore tests and full management."),
      s("wifi", "گزارش مصرف اینترنت", "Internet usage reports", "گزارش مصرف و بهینه‌سازی.", "Usage reports and optimisation."),
      s("phone", "VoIP و تلفن سازمانی", "VoIP & office phones", "پشتیبانی و مدیریت داخلی‌ها.", "Support and management of extensions."),
      s("server", "نگهداری زیرساخت", "Infrastructure upkeep", "نگهداری و برنامه‌ریزی ارتقای زیرساخت.", "Maintenance and upgrade planning."),
    ],
  },
  {
    id: "product", enabled: true, icon: "box",
    name: { fa: "طراحی محصول", en: "Product Design" },
    line: { fa: "ایده‌ات رو محصول کن", en: "Turn your idea into a product." },
    summary: { fa: "طراحی صنعتی، مدل‌سازی و رندر، نمونه‌سازی و پرینت سه‌بعدی.", en: "Industrial design, modelling and rendering, prototyping and 3D printing." },
    model: { fa: "پروژه‌ای", en: "Project" },
    intro: { fa: "از ایده تا نمونه‌ی قابل لمس.", en: "From an idea to something you can hold." },
    subs: [
      s("box", "طراحی صنعتی", "Industrial design", "طراحی فرم و عملکرد محصول.", "Designing the form and function of a product."),
      s("grid", "مدل‌سازی و رندر", "Modelling & rendering", "مدل سه‌بعدی و تصاویر رندر محصول.", "3D models and product renders."),
      s("layers", "نمونه‌سازی و پرینت سه‌بعدی", "Prototyping & 3D printing", "ساخت نمونه‌ی اولیه برای ارزیابی.", "Building a first prototype for evaluation."),
    ],
  },
];

export const SERVICES_UI = {
  inside: { fa: "زیرخدمات", en: "What's inside" },
  how: { fa: "نحوه‌ی همکاری", en: "How we work together" },
  jump: { fa: "پرش به بخش", en: "Jump to a section" },
  price: { fa: "[قیمت]", en: "[price]" },
  projectNote: { fa: "قیمت هر پروژه با توجه به دامنه‌ی کار تعیین می‌شود.", en: "Each project is priced by scope." },
  cta: { fa: "درخواست مشاوره", en: "Request a consultation" },
  homeMore: { fa: "زیرخدمات و پکیج‌ها", en: "Sub-services & packages" },
};
