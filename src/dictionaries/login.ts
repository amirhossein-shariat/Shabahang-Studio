import type { Locale } from "./index";

export type LoginDict = {
  meta: { title: string; description: string };
  kicker: string; title: string; intro: string;
  points: { icon: "users" | "lock" | "key"; title: string; text: string }[];
  form: {
    title: string; sub: string; id: string; idHint: string; password: string; show: string; hide: string; remember: string;
    forgot: string; forgotHelp: string; submit: string; required: string; notReady: string; noSms: string;
  };
  noAccount: string; contact: string;
};

const fa: LoginDict = {
  meta: { title: "ورود | شباهنگ استودیو", description: "ورود به حساب شباهنگ استودیو با شناسه و رمز عبور، برای مشتریان، تیم و مدیریت." },
  kicker: "ورود",
  title: "یک ورود برای همه",
  intro: "مشتریان، اعضای تیم و مدیریت با همین فرم وارد می‌شوند. بعد از ورود، بخش مناسب حساب شما باز می‌شود.",
  points: [
    { icon: "users", title: "نیازی به انتخاب نقش نیست", text: "شناسه و رمز را وارد کنید؛ نوع حساب شما به‌صورت خودکار تشخیص داده می‌شود." },
    { icon: "key", title: "ورود بدون پیامک", text: "برای ورود و ثبت‌نام از پیامک و کد یک‌بارمصرف استفاده نمی‌کنیم." },
    { icon: "lock", title: "حساب را شباهنگ می‌سازد", text: "شناسه و رمز اولیه را بعد از شروع همکاری به شما می‌دهیم." },
  ],
  form: {
    title: "ورود به حساب", sub: "شناسه و رمز عبور خود را وارد کنید.", id: "شناسه‌ی کاربری", idHint: "مثلاً ali.rezaei", password: "رمز عبور", show: "نمایش رمز", hide: "پنهان کردن رمز",
    remember: "مرا در این دستگاه نگه دار", forgot: "رمز را فراموش کرده‌اید؟", forgotHelp: "بازنشانی رمز را مدیر شباهنگ انجام می‌دهد. از صفحه‌ی تماس درخواست دهید.",
    submit: "ورود", required: "شناسه و رمز عبور را وارد کنید.", notReady: "سامانه‌ی ورود هنوز فعال نیست. به‌زودی با همین شناسه و رمز وارد می‌شوید.",
    noSms: "ورود فقط با شناسه و رمز عبور است و پیامکی ارسال نمی‌شود.",
  },
  noAccount: "حساب ندارید؟", contact: "با ما تماس بگیرید",
};

const en: LoginDict = {
  meta: { title: "Sign in | Shabahang Studio", description: "Sign in to your Shabahang Studio account with an ID and password, for clients, team and management." },
  kicker: "Sign in",
  title: "One sign-in for everyone",
  intro: "Clients, team members and management use this same form. After signing in, the area that matches your account opens.",
  points: [
    { icon: "users", title: "No role to choose", text: "Enter your ID and password; the type of your account is detected automatically." },
    { icon: "key", title: "No SMS", text: "We do not use text messages or one-time codes to sign in or sign up." },
    { icon: "lock", title: "Studio-created accounts", text: "We give you your ID and first password when we start working together." },
  ],
  form: {
    title: "Sign in to your account", sub: "Enter your ID and password.", id: "User ID", idHint: "e.g. ali.rezaei", password: "Password", show: "Show password", hide: "Hide password",
    remember: "Keep me signed in on this device", forgot: "Forgot your password?", forgotHelp: "A Shabahang admin resets passwords. Request it from the contact page.",
    submit: "Sign in", required: "Enter your ID and password.", notReady: "Sign-in is not live yet. Soon you will sign in with this same ID and password.",
    noSms: "Sign-in uses only an ID and password. No text message is sent.",
  },
  noAccount: "No account?", contact: "Contact us",
};

export const getLoginDict = (l: Locale) => (l === "fa" ? fa : en);
