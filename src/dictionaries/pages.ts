import type { Locale } from "./index";

export type AboutDict = {
  meta: { title: string; description: string };
  kicker: string; title: string; intro: string;
  name: { title: string; text: string };
  concept: { title: string; text: string };
  steps: { title: string; items: { name: string; text: string }[] };
  promise: { title: string; items: { name: string; text: string }[] };
  team: { title: string; placeholder: string };
  cta: string;
};

export type ContactDict = {
  meta: { title: string; description: string };
  kicker: string; title: string; intro: string;
  channels: { title: string; phone: string; call: string; telegram: string; bale: string; email: string; address: string; addressValue: string; hours: string; hoursValue: string };
  form: {
    title: string; name: string; reach: string; reachHint: string; service: string; message: string; submit: string;
    services: string[]; opened: string; fallback: string; required: string;
    subject: string; bodyName: string; bodyReach: string; bodyService: string;
  };
};

const aboutFa: AboutDict = {
  meta: { title: "درباره‌ی ما | شباهنگ استودیو", description: "شباهنگ استودیو، استودیوی طراحی، دیجیتال و IT برای برندهایی که هیچ‌وقت نمی‌خوابند." },
  kicker: "درباره‌ی ما",
  title: "استودیویی که شب هم بیدار است",
  intro: "شباهنگ استودیو طراحی، دیجیتال و IT را زیر یک سقف جمع کرده است تا شرکت‌ها و کسب‌وکارها برای هویت، سایت، محتوا و زیرساخت‌شان با یک تیم کار کنند.",
  name: { title: "معنی نام", text: "شباهنگ یعنی ستاره‌ی سحری، ستاره‌ی صبح، و کسی که شب بیدار است. برای ما یعنی بیدار، هوشیار و همیشه در دسترس؛ همان حسی که از پشتیبانی و IT انتظار دارید." },
  concept: { title: "حال‌وهوای برند", text: "لحظه‌ی بین شب و سپیده؛ نوری که تاریکی را می‌شکند. به همین دلیل سایت و هویت ما تیره و لوکس است، با طلایی ستاره‌ی صبح." },
  steps: {
    title: "ترتیب کار",
    items: [
      { name: "شناخت نیاز", text: "در جلسه‌ی اول کسب‌وکار، هدف و محدودیت‌های شما را می‌شنویم." },
      { name: "پیشنهاد و قرارداد", text: "شرح خدمات، زمان‌بندی، مبلغ، مراحل پرداخت، تعداد بازبینی و شرایط پشتیبانی روی کاغذ می‌آید." },
      { name: "اجرا و بازخورد", text: "طرح‌ها و پیشرفت کار را مرحله‌به‌مرحله می‌بینید و تأیید می‌کنید." },
      { name: "تحویل و پشتیبانی", text: "بعد از تحویل هم کنارتان می‌مانیم؛ با پشتیبانی رایگان سایت یا قرارداد ماهانه." },
    ],
  },
  promise: {
    title: "چیزهایی که روشن می‌گوییم",
    items: [
      { name: "مرز کار مشخص است", text: "رفع باگ همیشه رایگان است. امکان یا صفحه‌ی جدید جدا قیمت می‌خورد و این در قرارداد نوشته می‌شود." },
      { name: "قیمت پیش از شروع", text: "قیمت پروژه و پکیج‌ها پس از جلسه‌ی اول و بر اساس نیاز شما اعلام می‌شود." },
      { name: "یک تیم برای همه‌چیز", text: "طراح، توسعه‌دهنده و پشتیبان IT در یک استودیو کار می‌کنند و لازم نیست چند پیمانکار را هماهنگ کنید." },
    ],
  },
  team: { title: "تیم", placeholder: "[معرفی تیم — در انتظار محتوا]" },
  cta: "شروع گفتگو",
};

const aboutEn: AboutDict = {
  meta: { title: "About | Shabahang Studio", description: "Shabahang Studio is a design, digital and IT studio for brands that never sleep." },
  kicker: "About",
  title: "A studio that stays awake too",
  intro: "Shabahang Studio brings design, digital and IT under one roof, so companies and businesses can work with a single team on identity, web, content and infrastructure.",
  name: { title: "What the name means", text: "Shabahang is the morning star, and the one who stays up through the night. For us it means awake, alert and always reachable, the feeling you expect from support and IT." },
  concept: { title: "The feel of the brand", text: "The moment between night and dawn, light breaking through the dark. That is why our site and identity are dark and luxurious, with the gold of the morning star." },
  steps: {
    title: "How we work",
    items: [
      { name: "Understand the need", text: "In the first call we listen to your business, goals and constraints." },
      { name: "Proposal and contract", text: "Scope, schedule, price, payment stages, number of revisions and support terms are put in writing." },
      { name: "Build and feedback", text: "You see the work and approve it stage by stage." },
      { name: "Handover and support", text: "We stay with you after delivery, through free site support or a monthly contract." },
    ],
  },
  promise: {
    title: "What we state clearly",
    items: [
      { name: "A clear boundary", text: "Bug fixes are always free. A new feature or page is priced separately, and the contract says so." },
      { name: "Price before we start", text: "Project and package prices are shared after the first call, based on your need." },
      { name: "One team for everything", text: "Designers, developers and IT support work in one studio, so you do not coordinate several contractors." },
    ],
  },
  team: { title: "Team", placeholder: "[Team introduction — awaiting content]" },
  cta: "Start a conversation",
};

const contactFa: ContactDict = {
  meta: { title: "تماس با ما | شباهنگ استودیو", description: "راه‌های ارتباط با شباهنگ استودیو: تلفن، تلگرام، بله، ایمیل و فرم درخواست پروژه." },
  kicker: "تماس با ما",
  title: "درباره‌ی پروژه‌ات برایمان بنویس",
  intro: "هر کدام از راه‌ها برایتان راحت‌تر است همان را انتخاب کنید. فرم زیر یک ایمیل آماده می‌کند و برای ارسال، برنامه‌ی ایمیل شما باز می‌شود.",
  channels: {
    title: "راه‌های ارتباطی", phone: "تلفن", call: "تماس", telegram: "تلگرام", bale: "بله (با همین شماره)", email: "ایمیل",
    address: "نشانی", addressValue: "[نشانی استودیو — در انتظار اطلاعات]", hours: "ساعت پاسخ‌گویی", hoursValue: "[ساعت پاسخ‌گویی — در انتظار اطلاعات]",
  },
  form: {
    title: "درخواست پروژه", name: "نام و نام شرکت", reach: "راه تماس", reachHint: "شماره یا ایمیل", service: "موضوع", message: "توضیح کوتاه پروژه", submit: "آماده‌سازی ایمیل",
    services: ["برند و هویت", "سایت و نرم‌افزار", "محتوا و رشد", "IT و زیرساخت", "طراحی محصول", "هنوز مطمئن نیستم"],
    opened: "برنامه‌ی ایمیل شما باز شد. پیام را ارسال کنید تا به دست ما برسد.",
    fallback: "اگر چیزی باز نشد، همین متن را به این نشانی ایمیل کنید:", required: "نام و راه تماس را وارد کنید.",
    subject: "درخواست پروژه", bodyName: "نام", bodyReach: "راه تماس", bodyService: "موضوع",
  },
};

const contactEn: ContactDict = {
  meta: { title: "Contact | Shabahang Studio", description: "Ways to reach Shabahang Studio: phone, Telegram, Bale, email and a project request form." },
  kicker: "Contact",
  title: "Tell us about your project",
  intro: "Use whichever channel suits you. The form prepares an email, and your mail app opens so you can send it.",
  channels: {
    title: "Ways to reach us", phone: "Phone", call: "Call", telegram: "Telegram", bale: "Bale (same number)", email: "Email",
    address: "Address", addressValue: "[Studio address — awaiting details]", hours: "Response hours", hoursValue: "[Response hours — awaiting details]",
  },
  form: {
    title: "Project request", name: "Your name and company", reach: "How to reach you", reachHint: "Phone or email", service: "Topic", message: "A short description", submit: "Prepare email",
    services: ["Brand", "Web & Software", "Content & Growth", "IT & Infrastructure", "Product Design", "Not sure yet"],
    opened: "Your mail app opened. Send the message to get it to us.",
    fallback: "If nothing opened, email this text to:", required: "Enter your name and how to reach you.",
    subject: "Project request", bodyName: "Name", bodyReach: "Contact", bodyService: "Topic",
  },
};

export const getAboutDict = (l: Locale) => (l === "fa" ? aboutFa : aboutEn);
export const getContactDict = (l: Locale) => (l === "fa" ? contactFa : contactEn);
