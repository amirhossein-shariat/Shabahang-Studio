/**
 * DEMO ONLY. Two fixed preview accounts so the owner can look at the panels before the real
 * backend exists. This runs entirely in the browser, protects nothing, and must be deleted
 * (together with FEATURES.demoPanel) when real authentication is built. See docs/shabahang-panels-spec.md.
 */
export type Role = "client" | "staff" | "admin" | "ceo";
export type Session = { id: string; role: Role; name: string };

export const SESSION_KEY = "sh-demo-session";

const ACCOUNTS: { id: string; pw: string; role: Role; name: string }[] = [
  { id: "2222", pw: "2222", role: "client", name: "مشتری نمونه" },
  { id: "1111", pw: "1111", role: "ceo", name: "مدیرعامل (نمونه)" },
];

export function demoLogin(id: string, pw: string): Session | null {
  const a = ACCOUNTS.find((x) => x.id === id.trim() && x.pw === pw);
  return a ? { id: a.id, role: a.role, name: a.name } : null;
}

export function saveSession(s: Session) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch { /* private mode: the demo just will not remember you */ }
}
export function readSession(): Session | null {
  try {
    const v = sessionStorage.getItem(SESSION_KEY);
    return v ? (JSON.parse(v) as Session) : null;
  } catch { return null; }
}
export function clearSession() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* nothing to clear */ }
}
