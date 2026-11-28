/**
 * Frequently asked questions, per service. Edit, add or remove entries freely (the carousel adapts to any count);
 * the admin panel will edit this object later. `en` falls back to `fa` where no English text exists.
 * IT answers come from the owner's brief; the other services only restate what the site already says (no new promises).
 */
import type { PillarId } from "./services";

export type Faq = { q: { fa: string; en?: string }; a: { fa: string; en?: string } };

const f = (qf: string, af: string, qe?: string, ae?: string): Faq => ({ q: { fa: qf, en: qe }, a: { fa: af, en: ae } });

export const FAQ: Record<PillarId, Faq[]> = {
  brand: [
    f("چه خدماتی در برندینگ و هویت بصری هست؟", "لوگو و هویت بصری، کاتالوگ و مواد چاپی، بسته‌بندی گرافیکی و موشن لوگو.", "What does branding include?", "Logo and visual identity, catalogues and print, packaging graphics and logo motion."),
    f("هدف از هویت بصری چیست؟", "اینکه هر چیزی که مشتری از برند شما می‌بیند با یک زبان بصری یک‌دست دیده شود؛ از نشان تا کاتالوگ و بسته‌بندی.", "What is a visual identity for?", "So everything customers see of your brand shares one visual language, from the mark to catalogues and packaging."),
    f("قیمت پروژه چگونه اعلام می‌شود؟", "کار پروژه‌ای است؛ قیمت پس از جلسه‌ی اول و بر اساس دامنه‌ی کار اعلام می‌شود.", "How is the price set?", "It is project work; the price is shared after a first call, based on the scope."),
    f("کار چطور پیش می‌رود؟", "جلسه‌ی اول برای شناخت نیاز، سپس پیشنهاد و قرارداد، اجرا با بازخورد مرحله‌به‌مرحله و در پایان تحویل و پشتیبانی.", "How does the work go?", "A first call to understand the need, then a proposal and contract, execution with step-by-step feedback, and finally handover and support."),
  ],
  web: [
    f("پشتیبانی رایگان بعد از تحویل چیست؟", "۳ ماه پشتیبانی رایگان در قیمت پروژه است و شامل رفع باگ، آپدیت امنیتی، بکاپ و تغییرات کوچک تا سقف مشخص می‌شود.", "What is the free support after launch?", "3 months of free support are included in the project price: bug fixes, security updates, backups and small changes up to a set limit."),
    f("چه چیزهایی جدا قیمت می‌خورد؟", "امکان یا صفحه‌ی جدید و دامنه و هاست (سالانه) جدا قیمت می‌خورند و در قرارداد نوشته می‌شوند.", "What is priced separately?", "A new feature or page, and domain and hosting (yearly), are priced separately and written into the contract."),
    f("بعد از ۳ ماه چه می‌شود؟", "می‌توانید پشتیبانی ماهانه‌ی پایه یا حرفه‌ای بگیرید؛ این دو در ساعت تغییرات و سرعت پاسخ فرق دارند. رفع باگ همیشه رایگان است.", "What happens after 3 months?", "You can take a monthly Basic or Pro plan, which differ in change hours and response speed. Bug fixes are always free."),
    f("قیمت پروژه چطور تعیین می‌شود؟", "بر اساس نوع کار: سایت معرفی، سایت فروشگاهی، اپ یا پنل سفارشی؛ قیمت پس از جلسه‌ی اول اعلام می‌شود.", "How is the price set?", "By the type of work: company site, online store, custom app or panel; the price is shared after a first call."),
  ],
  growth: [
    f("در پکیج‌ها دقیقاً چه کارهایی انجام می‌شود؟", "استراتژی و تقویم محتوایی، سناریو، فیلم‌برداری (در نقره‌ای و طلایی)، تدوین ریلز، طراحی پست و استوری، کپشن و هشتگ، و گزارش ماهانه. تعداد هر مورد در جدول پکیج‌ها آمده است.", "What exactly is done in the packages?", "Content strategy and calendar, scripts, filming (in Silver and Gold), reel editing, post and story design, captions and hashtags, and a monthly report. The quantity of each item is listed in the packages table."),
    f("هزینه‌ی راه‌اندازی برای چیست؟", "یک‌بار و فقط در شروع همکاری دریافت می‌شود و شامل بررسی پیج و رقبا، تنظیم پروفایل و بیو، طراحی قالب بصری، کاور هایلایت‌ها و پاسخ‌های آماده است. در قرارداد ۶ ماهه رایگان است.", "What is the setup fee for?", "It is charged once, only at the start of the collaboration, and covers a review of your page and competitors, profile and bio setup, visual template design, highlight covers and ready replies. It is free on a 6-month contract."),
    f("بعد از قرارداد، کار کی شروع می‌شود؟", "راه‌اندازی حدود ۵ روز کاری بعد از دریافت اطلاعات کامل، پاسخ پرسشنامه و پرداخت اول طول می‌کشد و انتشار محتوا بعد از آن شروع می‌شود.", "When does the work start after the contract?", "Setup takes about 5 working days after we receive your complete information, the questionnaire answers and the first payment; content publishing starts after that."),
    f("به کامنت‌ها و دایرکت‌ها هم جواب می‌دهید؟", "پاسخ‌گویی با خود کسب‌وکار است. در پکیج نقره‌ای و طلایی برای سؤالات پرتکرار پاسخ‌های آماده می‌نویسیم تا جواب دادن سریع و یکدست باشد.", "Do you reply to comments and DMs?", "Replying is handled by the business itself. In the Silver and Gold packages we write ready replies for frequent questions so that answering is fast and consistent."),
    f("پرداخت چطور است؟", "قرارداد یک‌ماهه در شروع کامل پرداخت می‌شود. قرارداد سه‌ماهه و شش‌ماهه ۵۰٪ در شروع و ۵۰٪ در ابتدای ماه دوم.", "How does payment work?", "A 1-month contract is paid in full at the start. 3-month and 6-month contracts are paid 50% at the start and 50% at the beginning of the second month."),
    f("اگر محتوایی را نپسندم چه می‌شود؟", "برای هر محتوا ۲ نوبت اصلاح در نظر گرفته شده است. سناریوها و محتوای حاوی قیمت یا پیشنهاد قبل از انتشار به تأیید شما می‌رسد.", "What if I do not like a piece of content?", "Each piece includes 2 rounds of revisions. Scripts and any content containing a price or an offer are sent to you for approval before publishing."),
    f("فیلم‌برداری چطور انجام می‌شود؟", "در پکیج نقره‌ای ۱ جلسه و در طلایی ۲ جلسه در محل کسب‌وکار شما، هر جلسه تا ۴ ساعت. در پکیج برنزی راهنمای فیلم‌برداری با موبایل می‌دهیم.", "How does filming work?", "Silver includes 1 session and Gold 2 sessions at your business, each up to 4 hours. Bronze comes with a phone filming guide instead."),
    f("تعداد فالوور را تضمین می‌کنید؟", "خیر. فالوور، لایک یا ویو نمی‌خریم. رشد ارگانیک است و هر ماه معیارهای واقعی (بازدید، ذخیره، ارسال و فالو) را گزارش می‌دهیم.", "Do you guarantee a follower count?", "No. We never buy followers, likes or views. Growth is organic, and every month we report the real metrics (reach, saves, shares and follows)."),
    f("محتوای تخصصی (پزشکی، فنی و…) را چه کسی تأیید می‌کند؟", "محتوای تخصصی فقط بعد از تأیید کارشناس معرفی‌شده از طرف شما منتشر می‌شود.", "Who approves specialised content (medical, technical, etc.)?", "Specialised content is published only after approval by an expert you nominate."),
    f("قرارداد تمدید خودکار دارد؟ لغو چطور است؟", "تمدید خودکار نیست؛ ۷ روز قبل از پایان دوره شرایط تمدید را اعلام می‌کنیم. در قرارداد سه‌ماهه و شش‌ماهه، لغو با اطلاع کتبی ۳۰ روزه ممکن است.", "Does the contract renew automatically? What about cancelling?", "There is no automatic renewal; we announce the renewal terms 7 days before the period ends. On 3-month and 6-month contracts, cancelling is possible with 30 days' written notice."),
    f("برای امضای قرارداد باید حضوری بیاییم؟", "نه. قرارداد را می‌توانید امضا کنید و عکس یا اسکن آن را بفرستید.", "Do we have to come in person to sign the contract?", "No. You can sign the contract and send us a photo or scan of it."),
  ],
  it: [
    f("خدمات پشتیبانی IT به چه کسب‌وکارهایی ارائه می‌شود؟", "این خدمات برای شرکت‌ها، دفاتر و کسب‌وکارهای کوچک و متوسط طراحی شده‌اند. پیش از شروع همکاری، تعداد کاربران، تجهیزات، سرورها و پیچیدگی زیرساخت بررسی می‌شود تا پکیج متناسب پیشنهاد شود."),
    f("پشتیبانی به‌صورت حضوری انجام می‌شود یا غیرحضوری؟", "خدمات به‌صورت ترکیبی ارائه می‌شوند. بسیاری از مشکلات از راه دور قابل بررسی و رفع هستند و مواردی که به حضور کارشناس نیاز داشته باشند، طبق سهمیه قرارداد و با هماهنگی قبلی در محل مشتری انجام می‌شوند."),
    f("آیا پشتیبانی به‌صورت ۲۴ ساعته و هفت روز هفته است؟", "خیر. پشتیبانی پکیج‌های فعلی در ساعات کاری توافق‌شده در قرارداد ارائه می‌شود. پشتیبانی خارج از ساعات کاری یا خدمات اضطراری خارج از برنامه، در صورت امکان و با توافق و هزینه جداگانه قابل بررسی است."),
    f("تفاوت پکیج Basic و Professional چیست؟", "پکیج Basic برای مجموعه‌های کوچک با نیازهای روزمره IT و زیرساخت ساده مناسب است. پکیج Professional علاوه بر پشتیبانی کاربران، خدمات گسترده‌تری برای شبکه سازمانی، سرورها، مجازی‌سازی، VoIP، پایش و مستندسازی ارائه می‌دهد و سقف ساعت و مراجعه بیشتری دارد."),
    f("آیا تعداد درخواست‌های پشتیبانی محدود است؟", "تعداد پیام‌ها یا ثبت درخواست‌ها به‌تنهایی معیار محدودیت نیست؛ اما مجموع زمان انجام کار از سقف ساعات ماهانه پکیج بیشتر نمی‌شود. درخواست‌ها بر اساس اولویت و زمان موردنیاز رسیدگی می‌شوند."),
    f("اگر ساعات پشتیبانی ماهانه تمام شود چه اتفاقی می‌افتد؟", "در صورت پایان سهمیه ماهانه، ادامه خدمات با تأیید مشتری و طبق تعرفه خدمات خارج از پکیج محاسبه می‌شود یا در صورت نیاز، ارتقای پکیج پیشنهاد خواهد شد."),
    f("آیا ساعات استفاده‌نشده به ماه بعد منتقل می‌شوند؟", "خیر. ساعات پشتیبانی و مراجعات حضوری، سهمیه همان ماه هستند و به ماه بعد انتقال داده نمی‌شوند."),
    f("زمان پاسخ‌گویی به درخواست‌ها چقدر است؟", "در پکیج Basic پاسخ اولیه درخواست عادی حداکثر تا یک روز کاری و در Professional حداکثر چهار ساعت کاری است. درخواست اضطراری در Professional، در صورت تأیید سطح فوریت و در ساعات پشتیبانی، حداکثر طی دو ساعت کاری وارد مرحله بررسی اولیه می‌شود. زمان پاسخ اولیه با زمان رفع کامل مشکل متفاوت است."),
    f("آیا با خرید پکیج، راه‌اندازی سرور یا شبکه جدید هم رایگان است؟", "خیر. پکیج‌ها برای پشتیبانی و نگهداری زیرساخت موجود در محدوده قرارداد هستند. راه‌اندازی جدید، توسعه شبکه، نصب سرور، مهاجرت، کابل‌کشی و پروژه‌های مشابه به‌صورت مستقل برآورد و اجرا می‌شوند."),
    f("آیا هزینه خرید تجهیزات و نرم‌افزار در مبلغ پکیج محاسبه شده است؟", "خیر. هزینه سخت‌افزار، قطعات، لایسنس، نرم‌افزارهای تجاری، سرویس‌های شخص ثالث، اینترنت و اقلام مصرفی جداگانه بر عهده مشتری است."),
    f("اگر شرکت بیش از سقف کاربران یا تجهیزات پکیج داشته باشد چه می‌شود؟", "پیش از عقد قرارداد، زیرساخت بررسی می‌شود. در صورت بیشتر بودن تعداد کاربران، دستگاه‌ها، سرورها یا شعب از سقف پکیج، باید محدوده خدمات و هزینه متناسب با شرایط واقعی اصلاح شود."),
    f("آیا خدمات پروژه‌ای را بدون خرید پکیج هم می‌توان سفارش داد؟", "بله. خدماتی مانند طراحی شبکه، راه‌اندازی سرور، مجازی‌سازی، VPN، VoIP، بکاپ، امنیت و پسیو شبکه به‌صورت پروژه‌ای و مستقل از اشتراک قابل سفارش هستند."),
    f("آیا از اطلاعات و فایل‌های شرکت نسخه پشتیبان تهیه می‌کنید؟", "در پکیج‌ها وضعیت اجرای فرایند بکاپ موجود بررسی می‌شود. طراحی یا پیاده‌سازی سامانه بکاپ جدید، افزایش فضای ذخیره‌سازی و اجرای پروژه بازیابی اطلاعات، جزو خدمات پروژه‌ای هستند؛ مگر آنکه در قرارداد به‌صورت مشخص درج شوند."),
    f("آیا امنیت شبکه و اطلاعات شرکت را تضمین می‌کنید؟", "اقدامات امنیتی با هدف کاهش ریسک و اصلاح تنظیمات قابل‌بهبود انجام می‌شوند؛ اما هیچ زیرساختی را نمی‌توان در برابر تمام تهدیدها، خطاهای انسانی یا حوادث، صددرصد ایمن تضمین کرد. محدوده اقدامات امنیتی در قرارداد مشخص می‌شود."),
    f("برای شروع همکاری چه اطلاعاتی لازم است؟", "در مرحله اول، اطلاعاتی مانند تعداد کاربران و سیستم‌ها، تعداد شعب، تعداد سرورها، تجهیزات اصلی شبکه، سرویس‌های حیاتی و مشکلات فعلی دریافت می‌شود. سپس ارزیابی اولیه و پیشنهاد پکیج یا پروژه مناسب ارائه خواهد شد."),
    f("آیا امکان ارتقای پکیج در طول همکاری وجود دارد؟", "بله. در صورت افزایش تعداد کاربران، تجهیزات یا نیازهای پشتیبانی، امکان بررسی و ارتقای پکیج با توافق طرفین وجود دارد."),
    f("آیا قرارداد سه‌ماهه شامل تخفیف است؟", "بله. قرارداد سه‌ماهه با حدود پنج درصد تخفیف نسبت به پرداخت ماهانه ارائه می‌شود. مبلغ و شیوه پرداخت در پیشنهاد رسمی و قرارداد درج خواهد شد."),
    f("آیا اطلاعات دسترسی و رمزهای عبور شرکت محرمانه می‌مانند؟", "اطلاعات دسترسی صرفاً برای انجام خدمات مورد توافق استفاده می‌شوند. دسترسی‌ها باید با مجوز مشتری و از مسیر امن انجام شوند و توصیه می‌شود حساب‌های اختصاصی با حداقل سطح دسترسی لازم ایجاد شوند. رمزهای عبور نباید در پیام‌ها یا مستندات عمومی و ناامن نگهداری شوند."),
  ],
  product: [
    f("چه خدماتی در طراحی محصول هست؟", "طراحی صنعتی، مدل‌سازی و رندر، نمونه‌سازی و پرینت سه‌بعدی.", "What does product design include?", "Industrial design, modelling and rendering, prototyping and 3D printing."),
    f("طراحی محصول از کجا شروع می‌شود؟", "از ایده تا نمونه‌ی قابل لمس؛ در جلسه‌ی اول ایده و محدودیت‌های شما شنیده می‌شود.", "Where does it start?", "From an idea to something you can hold; in the first call we hear your idea and constraints."),
    f("قیمت پروژه چگونه اعلام می‌شود؟", "کار پروژه‌ای است؛ قیمت پس از جلسه‌ی اول و بر اساس دامنه‌ی کار اعلام می‌شود.", "How is the price set?", "It is project work; the price is shared after a first call, based on the scope."),
  ],
};

export const FAQ_UI = {
  title: { fa: "پرسش‌های متداول", en: "Frequently asked questions" },
  sub: { fa: "پاسخ رایج‌ترین پرسش‌ها؛ با فلش‌ها یا کشیدن، بین پرسش‌ها حرکت کنید.", en: "Answers to the most common questions; use the arrows or swipe to move between them." },
  list: { fa: "نمایش به‌صورت فهرست", en: "Show as a list" },
  carousel: { fa: "نمایش به‌صورت کاروسل", en: "Show as a carousel" },
  of: { fa: "از", en: "of" },
  prev: { fa: "پرسش قبلی", en: "Previous question" },
  next: { fa: "پرسش بعدی", en: "Next question" },
  moreTitle: { fa: "پرسش شما اینجا نبود؟", en: "Your question is not here?" },
  moreText: { fa: "برایمان بنویسید تا پاسخ بدهیم.", en: "Write to us and we will answer." },
  moreButton: { fa: "ارتباط با ما", en: "Contact us" },
};
