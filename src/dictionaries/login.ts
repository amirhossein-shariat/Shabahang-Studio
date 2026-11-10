import type { Locale } from "./index";

export type LoginDict = {
  meta: { title: string; description: string };
  tabs: { login: string; signup: string };
  show: string; hide: string; contact: string;
  login: {
    title: string; sub: string; id: string; idHint: string; password: string;
    forgot: string; forgotHelp: string; submit: string; required: string; notReady: string; toSignup: string; toSignupLink: string; invalid: string;
  };
  signup: {
    title: string; sub: string; name: string; nameHint: string; id: string; idHint: string; password: string; confirm: string;
    submit: string; strength: { label: string; weak: string; fair: string; strong: string };
    requiredAll: string; badId: string; short: string; mismatch: string; notReady: string; toLogin: string; toLoginLink: string;
  };
};

const fa: LoginDict = {
  meta: { title: "ورود و ساخت حساب | شباهنگ استودیو", description: "ورود به حساب یا ساخت حساب در شباهنگ استودیو با شناسه و رمز عبور." },
  tabs: { login: "ورود", signup: "ساخت حساب" },
  show: "نمایش رمز", hide: "پنهان کردن رمز", contact: "تماس با ما",
  login: {
    title: "ورود به حساب", sub: "شناسه و رمز عبور خود را وارد کنید.", id: "شناسه‌ی کاربری", idHint: "مثلاً ali.rezaei", password: "رمز عبور",
    forgot: "رمز را فراموش کرده‌اید؟", forgotHelp: "بازنشانی رمز را مدیر شباهنگ انجام می‌دهد. از صفحه‌ی تماس درخواست دهید.",
    submit: "ورود", required: "شناسه و رمز عبور را وارد کنید.", notReady: "سامانه‌ی ورود هنوز فعال نیست. به‌زودی با همین شناسه و رمز وارد می‌شوید.",
    toSignup: "حساب ندارید؟", toSignupLink: "ساخت حساب", invalid: "شناسه یا رمز عبور درست نیست.",
  },
  signup: {
    title: "ساخت حساب", sub: "اطلاعات زیر را کامل کنید.", name: "نام و نام خانوادگی یا نام شرکت", nameHint: "مثلاً علی رضایی", id: "شناسه‌ی کاربری", idHint: "مثلاً ali.rezaei",
    password: "رمز عبور", confirm: "تکرار رمز عبور", submit: "ساخت حساب",
    strength: { label: "قدرت رمز", weak: "ضعیف", fair: "متوسط", strong: "قوی" },
    requiredAll: "همه‌ی فیلدها را کامل کنید.", badId: "شناسه فقط می‌تواند حروف انگلیسی، عدد، نقطه و خط زیر داشته باشد.",
    short: "رمز عبور باید حداقل ۸ نویسه باشد.", mismatch: "رمز عبور و تکرار آن یکسان نیستند.",
    notReady: "ساخت حساب هنوز فعال نیست. به‌زودی با همین اطلاعات حساب می‌سازید.", toLogin: "حساب دارید؟", toLoginLink: "ورود",
  },
};

const en: LoginDict = {
  meta: { title: "Sign in & create account | Shabahang Studio", description: "Sign in to your account or create one at Shabahang Studio with an ID and password." },
  tabs: { login: "Sign in", signup: "Create account" },
  show: "Show password", hide: "Hide password", contact: "Contact us",
  login: {
    title: "Sign in to your account", sub: "Enter your ID and password.", id: "User ID", idHint: "e.g. ali.rezaei", password: "Password",
    forgot: "Forgot your password?", forgotHelp: "A Shabahang admin resets passwords. Request it from the contact page.",
    submit: "Sign in", required: "Enter your ID and password.", notReady: "Sign-in is not live yet. Soon you will sign in with this same ID and password.",
    toSignup: "No account?", toSignupLink: "Create one", invalid: "The ID or password is not correct.",
  },
  signup: {
    title: "Create your account", sub: "Fill in the details below.", name: "Full name or company", nameHint: "e.g. Ali Rezaei", id: "User ID", idHint: "e.g. ali.rezaei",
    password: "Password", confirm: "Repeat password", submit: "Create account",
    strength: { label: "Password strength", weak: "Weak", fair: "Fair", strong: "Strong" },
    requiredAll: "Fill in every field.", badId: "The ID can only contain English letters, digits, dot and underscore.",
    short: "The password must be at least 8 characters.", mismatch: "The password and its repeat do not match.",
    notReady: "Account creation is not live yet. Soon you will create your account with these details.", toLogin: "Already have an account?", toLoginLink: "Sign in",
  },
};

export const getLoginDict = (l: Locale) => (l === "fa" ? fa : en);
