import type { Locale } from "./index";

export const CATEGORY_SLUGS = ["brand", "web", "growth", "it", "product"] as const;
export type Slug = (typeof CATEGORY_SLUGS)[number];
export const isSlug = (s: string): s is Slug => (CATEGORY_SLUGS as readonly string[]).includes(s);

export type WorkDict = {
  meta: { title: string; description: string };
  kicker: string; title: string; intro: string;
  cats: Record<Slug, { name: string; line: string; blurb: string }>;
  count: string; open: string; placeholder: string; soon: string; others: string; allWork: string;
  ctaTitle: string; ctaButton: string; client: string;
};

const fa: WorkDict = {
  meta: { title: "نمونه‌کارها | شباهنگ استودیو", description: "نمونه‌کارهای شباهنگ استودیو در پنج بخش: برند، سایت، محتوا، IT و طراحی محصول." },
  kicker: "نمونه‌کارها",
  title: "کارهایمان، بخش‌به‌بخش",
  intro: "هر ستون خدمات صفحه‌ی خودش را دارد تا همان کاری را ببینید که دنبالش هستید.",
  cats: {
    brand: { name: "برندینگ و هویت بصری", line: "به کسب‌وکارت یک چهره بده", blurb: "لوگو، هویت بصری، کاتالوگ، بسته‌بندی گرافیکی و موشن لوگو." },
    web: { name: "طراحی سایت و اپلیکیشن", line: "آنلاین شو", blurb: "سایت معرفی، سایت فروشگاهی و پنل‌های سفارشی." },
    growth: { name: "شبکه‌های اجتماعی و محتوا", line: "دیده شو", blurb: "طراحی پست و استوری، موشن و ویدیو، تولید محتوا و مدیریت پیج." },
    it: { name: "پشتیبانی IT و شبکه", line: "سیستم‌هات همیشه سالم و روشن بمونن", blurb: "پشتیبانی کاربران، شبکه، بکاپ و VoIP." },
    product: { name: "طراحی محصول", line: "ایده‌ات رو محصول کن", blurb: "طراحی صنعتی، مدل‌سازی و رندر، نمونه‌سازی و پرینت سه‌بعدی." },
  },
  count: "پروژه", open: "دیدن نمونه‌ها", placeholder: "[نمونه‌کار — در انتظار محتوا]", soon: "اولین نمونه‌های این بخش به‌زودی اضافه می‌شوند.",
  others: "بخش‌های دیگر", allWork: "همه‌ی نمونه‌کارها", ctaTitle: "پروژه‌ی بعدی می‌تواند مال تو باشد", ctaButton: "شروع پروژه", client: "مشتری",
};

const en: WorkDict = {
  meta: { title: "Work | Shabahang Studio", description: "Shabahang Studio's work in five sections: brand, web, content, IT and product design." },
  kicker: "Work",
  title: "Our work, section by section",
  intro: "Each service pillar has its own page, so you can go straight to the kind of work you are after.",
  cats: {
    brand: { name: "Branding & Visual Identity", line: "Give your business a face.", blurb: "Logo, visual identity, catalogues, packaging graphics and logo motion." },
    web: { name: "Web & App Development", line: "Get online.", blurb: "Company sites, online stores and custom panels." },
    growth: { name: "Social Media & Content", line: "Get seen.", blurb: "Post and story design, motion and video, content and page management." },
    it: { name: "IT Support & Networks", line: "Keep your systems healthy and on.", blurb: "User support, networks, backups and VoIP." },
    product: { name: "Product Design", line: "Turn your idea into a product.", blurb: "Industrial design, modelling and rendering, prototyping and 3D printing." },
  },
  count: "projects", open: "See the work", placeholder: "[Project — awaiting content]", soon: "The first projects in this section are coming soon.",
  others: "Other sections", allWork: "All work", ctaTitle: "Your project could be next", ctaButton: "Start a project", client: "Client",
};

export const getWorkDict = (l: Locale) => (l === "fa" ? fa : en);
