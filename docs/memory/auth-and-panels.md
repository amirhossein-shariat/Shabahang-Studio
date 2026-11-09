# Sign-in and sign-up — requirements and status

Built (design only): `/fa/login`, `/en/login` — one centred card with two tabs, **Sign in** and **Create account**
(`src/components/LoginForm.tsx`, texts in `src/dictionaries/login.ts`), plus a "ورود" link in the header.
Both forms only validate and say the system is not live yet; they send nothing.

## Owner's rules
1. **People create their own accounts** (sign-up exists) and then sign in with a user ID + password.
   The owner said clients and staff already know the login is shared, so the page does **not** advertise it, has no
   "contact us if you have no account" text and no explanation of roles.
2. **The role is detected after the credentials are checked**, on the server, from the account record. There is no role picker and
   the UI must never reveal which roles exist.
3. **No SMS services at all** for sign-up or sign-in: no OTP, no text-message codes, no phone verification.
   Do not add an SMS provider, "send code" buttons or phone-number login. (The earlier on-page "no SMS" sentence was removed at the owner's request; the rule itself stays.)

## What the sign-up form collects
Full name or company, user ID (English letters, digits, dot, underscore; 3 to 32 chars), password (min 8, strength meter), repeat password.
No phone number, no email verification step. Placeholders and inputs follow the page direction (right-aligned on Persian pages).

## Open questions for the real build
- How do **staff and the main admin** get their roles? Self-service sign-up must only ever create ordinary client accounts;
  elevated roles have to be granted by an existing admin (never by what the user types or picks).
- Should new client accounts be active at once or wait for admin approval? Without SMS or email verification, approval avoids fake accounts.
- Password reset without SMS: admin-issued temporary password (current text on the page), or an email link later (email is not SMS, confirm first).

## Security notes for the real implementation
- Hash passwords with argon2id or bcrypt; never store or log plain text. Rate-limit attempts per ID and per IP, with a temporary lockout; rate-limit sign-up too.
- Session in an `HttpOnly`, `Secure`, `SameSite=Lax` cookie; CSRF protection on both forms; same generic error for "unknown ID" and "wrong password".
- Check ID uniqueness on the server and reject reserved IDs (admin, root, support, ...). Log sign-ins and failures for the admin.
- After sign-in redirect by role: client portal (brief phase 2: projects, files, tickets, invoices, reports), team panel (phase 3: tasks, hours, comments), admin panel (see `admin-panel.md`).
- Needs a server runtime and a database; hosting is still undecided (see `admin-panel.md`).
