/** Jalali (Persian) calendar helpers shared by the panel and the invoice tool. Standard jalaali algorithm. */
const div = (a: number, b: number) => ~~(a / b);
const mod = (a: number, b: number) => a - ~~(a / b) * b;
const BREAKS = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
function jalCal(jy: number, withoutLeap: boolean) {
  const bl = BREAKS.length; const gy = jy + 621;
  let leapJ = -14, jp = BREAKS[0], jm = 0, jump = 0, leap = 0, n = 0;
  for (let i = 1; i < bl; i++) {
    jm = BREAKS[i]; jump = jm - jp;
    if (jy < jm) break;
    leapJ += div(jump, 33) * 8 + div(mod(jump, 33), 4); jp = jm;
  }
  n = jy - jp;
  leapJ += div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  if (withoutLeap) return { gy, march, leap: 0 };
  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
  leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;
  return { gy, march, leap };
}
function g2d(gy: number, gm: number, gd: number) {
  let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4) + div(153 * mod(gm + 9, 12) + 2, 5) + gd - 34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}
function d2g(jdn: number) {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1, gm = mod(div(i, 153), 12) + 1, gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}
const j2d = (jy: number, jm: number, jd: number) => { const r = jalCal(jy, true); return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1; };
function d2j(jdn: number) {
  const gy = d2g(jdn).gy; let jy = gy - 621;
  const r = jalCal(jy, false), f = g2d(gy, 3, r.march);
  let k = jdn - f, jm: number, jd: number;
  if (k >= 0) {
    if (k <= 185) { jm = 1 + div(k, 31); jd = mod(k, 31) + 1; return { jy, jm, jd }; }
    k -= 186;
  } else { jy -= 1; k += 179; if (r.leap === 1) k += 1; }
  jm = 7 + div(k, 30); jd = mod(k, 30) + 1;
  return { jy, jm, jd };
}
export const toJalali = (gy: number, gm: number, gd: number) => d2j(g2d(gy, gm, gd));
export const toGregorian = (jy: number, jm: number, jd: number) => d2g(j2d(jy, jm, jd));
export const jMonthLen = (jy: number, jm: number) => (jm <= 6 ? 31 : jm <= 11 ? 30 : jalCal(jy, false).leap === 0 ? 30 : 29);
export const MONTHS = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
export const WEEKDAYS = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];
/** Column of a Jalali date in a Saturday-first week (0 = شنبه) */
export function weekCol(jy: number, jm: number, jd: number) { const g = toGregorian(jy, jm, jd); return (new Date(g.gy, g.gm - 1, g.gd).getDay() + 1) % 7; }
/** Today's Jalali date in Tehran time */
export function tehranToday() {
  const s = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tehran" }).format(new Date());
  const [y, m, d] = s.split("-").map(Number);
  return toJalali(y, m, d);
}
export const pad2 = (n: number) => String(n).padStart(2, "0");
const FA = "۰۱۲۳۴۵۶۷۸۹";
export const toFaDigits = (s: string) => s.replace(/\d/g, (d) => FA[Number(d)]);
export const toLatinDigits = (s: string) => s.replace(/[۰-۹]/g, (d) => String(FA.indexOf(d))).replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
