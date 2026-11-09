# Sign-in and panels — requirements (design only so far)

Built: the sign-in page `/fa/login`, `/en/login` (`src/components/LoginForm.tsx`, texts in `src/dictionaries/login.ts`) and a "ورود"
link in the header. The form only validates and says sign-in is not live yet; it sends nothing.

## Owner's rules
1. **One sign-in for everyone**: clients, team members and the main admin use the same form (user ID + password).
2. **The role is detected after the credentials are checked**, on the server, from the account record. The form has no role picker,
   and the page must not reveal which roles exist.
3. **No SMS services at all** for sign-up or sign-in: no OTP, no text-message codes, no phone verification.
   Do not add an SMS provider, "send code" buttons or phone-number login.

## Consequences for the design
- Accounts are **created by an admin** (no public sign-up). The studio hands out the ID and a first password. A "no account? contact us" link points to `/contact`.
- **Password reset** is done by an admin (temporary password), not by SMS. An email-based reset is possible later; email is not SMS, but confirm with the owner first.
- After sign-in, redirect by role: client → client portal (brief phase 2: projects, files, tickets, invoices, reports),
  team → internal panel (brief phase 3: tasks, hours, comments), main admin → admin panel (see `admin-panel.md`).

## Security notes for the real implementation
- Hash passwords with argon2id or bcrypt; never store or log plain text. Rate-limit attempts per ID and per IP, with a temporary lockout.
- Session in an `HttpOnly`, `Secure`, `SameSite=Lax` cookie; CSRF protection on the form; same generic error for "unknown ID" and "wrong password".
- Force a password change on first sign-in for admin-created accounts. Log sign-ins and failures for the admin.
- Persian digits and RTL must work in the ID field (keep it `dir="ltr"`, lowercase Latin by convention).
- Needs a server runtime and a database; hosting is still undecided (see `admin-panel.md`).
