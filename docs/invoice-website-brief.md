# Add the Invoice feature (فاکتورها) to the user's website — self-contained brief

This file is the **only** document you get. It covers **only the invoice tab** (not the finance section). Reply to the user in **Persian, short**; code and comments in English; fast and simple, ask only on real decisions.

## 1. What it is

A private, single-owner invoice tool in Persian (RTL, Jalali dates, amounts in rial). The owner, Amirhossein Shariat, sells 3D printing, industrial design and graphic design services. He creates an invoice, sees a live A4 preview identical to his printed sample (navy `#14304f`, green `#4cb582`, "SA" column logo), and exports it to PDF through the browser's Save-as-PDF. All invoices are stored and can be reopened/edited. It already works as a desktop app; the job is to run the same feature **inside his website**, behind his login.

## 2. Features that must exist (all already built and tested on desktop)

1. **Form**: customer name, customer phone, Jalali date (custom date picker, default today), row items (description, qty, unit price), discount (amount or %), note. Enter in a row jumps to the next row / creates one. Prices get comma-grouped while typing.
2. **Live A4 preview** (CSS `zoom` to fit the column). Header: date, provider label «ارائه‌دهنده خدمات» + name + phone (from settings), customer name + phone, logo. Table columns: ردیف، شرح خدمات، تعداد، فی، مبلغ کل (min 10 rows). Footer: جمع کل، تخفیف، مبلغ قابل پرداخت with «ریال» beside the payable amount only; note box = the user's note on line 1 and the fixed line «کلیه‌ی مبالغ به ریال می‌باشد.» below it (editable setting); bank block (card number, bank, account name, sheba) from settings.
3. **One-page fit** (`fitToPage()` in app.js): drop empty filler rows → then `.compact` spacing → only then `.grow` onto a second page. Re-measured at `beforeprint` (zoom 1) and after fonts load.
4. **PDF**: button «خروجی PDF» auto-saves, sets `document.title` to `فاکتور-<number>-<customer>`, calls `window.print()`; CSS `@page { size:A4; margin:0 }` and `@media print` hide everything except the sheet.
5. **Drag & drop** reordering of rows via a ⋮⋮ handle (only the handle makes the row draggable).
6. **Saved invoices list** (right column): click to open/edit, search, soft delete («حذف» moves to a deleted store, never hard delete), «کپی از این فاکتور» (copy, resets paid=false, new number/date), unsaved-changes guard.
7. **Paid status**: checkbox on each list item, saved immediately without touching unsaved edits in the editor; soft green = paid, soft red = unpaid. Not printed on the invoice.
8. **Phone book** on the customer-name field (dropdown, type-to-filter, arrows+Enter, picking fills name **and** phone; contacts auto-added/updated on save; ✕ removes a contact only).
9. **Name filter** «اسم‌ها» above the list (all / one customer, with counts) + summary «N فاکتور · پرداخت‌نشده: X ریال». Names are normalized (Arabic ي/ك → ی/ک, ZWNJ/spaces collapsed).
10. **Settings dialog** (تنظیمات): provider label, name, phone, card number, bank, account name, sheba, currency («ریال»), fixed note line.
11. Hotkeys Ctrl+S (save), Ctrl+P (PDF). Layout: 3 columns (list · editor · preview), collapses to one column ≤1150px.

## 3. Files to reuse (copy from the desktop project's `app/` folder)

The UI is vanilla JS, no framework, no build step, no npm packages.

| File | Role |
|---|---|
| `index.html` | page skeleton. **It also contains the finance section** (`#modeFin` button in the header, `#finTabs`, `#finBody`, and scripts `ledger.js insights.js finance.js finance-plus.js charts.js finance-reports.js`). **Remove all finance parts**; keep the invoice header/columns, the settings `<dialog>`, toast, `#fatal`. |
| `app.js` | ALL invoice logic (state, rendering, events). Independent of finance code. Uses globals (`$`, `settings`, `invoices`, `contacts`, `cur`, …). |
| `style.css` | app UI + A4 sheet + print CSS. Contains finance styles too (classes starting `fin-`, `pb-` is the phone book — keep); delete the finance-only rules. |
| `jalali.js`, `datepicker.js` | Jalali conversion/Tehran time and the date picker (`JDP.attach($('#fDate'))`). Keep as they are. |
| `logo.png`, `icon.png`, `Vazirmatn.woff2` | logo cropped from his sample, favicon, **self-hosted** variable Persian font. Don't use a CDN for fonts/scripts (Iranian networks often block them). |

Do not copy anything from `data\` (live personal data) or the desktop launcher.

## 4. Data model

Invoice (one record each; keep the shape, the UI depends on it):
```json
{ "id":"0001","number":1,"date":"۱۴۰۵/۰۷/۲۰","customerName":"…","customerPhone":"09…",
  "items":[{"desc":"…","qty":1,"price":47500000}],
  "discount":0,"discountType":"amount|percent","note":"","paid":false,
  "createdAt":"ISO","updatedAt":"ISO" }
```
- Amounts are plain numbers in **rial**. `date` is a Jalali string `YYYY/MM/DD` (Persian digits accepted/produced).
- `number` = max existing + 1, assigned **server-side** inside a transaction / unique constraint; `id` = number zero-padded to 4 digits. Old invoices without `paid` count as unpaid.
- Settings object: `designerName, designerPhone, cardNumber, bank, accountName, sheba` (server defaults) + client defaults `providerLabel='ارائه‌دهنده خدمات'`, `currency='ریال'`, `noteFooter='کلیه‌ی مبالغ به ریال می‌باشد.'` (the client merges its defaults over what the server returns).
- Contacts: `[{ "name":"…", "phone":"…" }]` — `GET` returns `null` until first saved, then the client seeds it from existing invoices and PUTs it.

## 5. API contract the UI already calls (keep the same URLs/JSON, put them under the site's prefix)

- `GET /api/invoices` → array sorted by `number` desc. `PUT /api/invoices` → body = invoice; no `id` ⇒ create (assign number/id/createdAt), else update; always set `updatedAt`; returns the saved invoice. `DELETE /api/invoices/:id` → soft delete.
- `GET/PUT /api/settings`, `GET/PUT /api/contacts` (whole-object / whole-list read & write).
- Make the base path configurable (e.g. `window.API_BASE`) so calls work under a prefix like `/admin/invoices/api/...`.

## 6. Integration plan

1. **Inspect the site first**: framework/language, router, auth + roles, database and migrations, hosting (inside or outside Iran), HTTPS, how pages are templated. Tell the user in 3–4 lines what you chose (mount path, storage, how the UI is embedded) and continue unless he objects.
2. **Storage**: tables/collections `invoices`, `settings`, `contacts` scoped by owner user id (even if there is one user). Keep JSON shapes above. Soft delete via a flag/table. Use DB transactions for the number assignment.
3. **Embedding**: serve the UI as its **own page** inside the authenticated area (its own HTML shell loading the files above, same origin) or in an iframe — the JS uses globals and would clash with the site's scripts if merged into a shared page. Don't rewrite into components unless embedding is impossible (ask first). Add a menu entry «فاکتورها» in the site's navigation only.
4. **Style**: RTL, Vazirmatn, navy/green as in the desktop app; the invoice sheet itself must stay pixel-faithful (A4, same table proportions).
5. **Migration of existing invoices** (optional, only if the user wants them on the site): he will give you a **copy** of his `data\invoices\*.json`, `settings.json`, `contacts.json`. Write a one-off idempotent import that keeps ids/numbers/`paid`. Never ask to touch his live folder.

## 7. Security (mandatory)

Invoices contain customers' names/phones and the owner's bank details.
- Every page and every `/api/*` route of this feature requires an authenticated session with the owner role; deny by default; authorize on the server, not only in the UI.
- HTTPS only; secure/HttpOnly/SameSite cookies; CSRF protection for PUT/DELETE following the site's mechanism; basic rate limiting.
- Escape all output (the UI already uses `esc()` — keep it); no third-party scripts, fonts or analytics on these pages.

## 8. Acceptance checklist

- [ ] Logged-out visitor and a non-owner user cannot open the page or call any API (test both).
- [ ] Create → save → reload → edit → save works; numbers increase without gaps/duplicates (try two quick saves).
- [ ] A4 preview and **Save-as-PDF** look like the desktop version: one page for ≤13 rows (long descriptions wrap in the description column, empty rows disappear first), Vazirmatn embedded, no browser header/footer when "Headers and footers" is off.
- [ ] «ریال» appears only next to the payable amount; the fixed note line appears under the user's note (or alone when the note is empty).
- [ ] Drag & drop of rows, paid checkbox (saves instantly, doesn't lose unsaved edits), copy, delete (soft), phone book, name filter + unpaid summary all work.
- [ ] Works at phone width at least for list + editor (the preview may stay below).
- [ ] The user received a short Persian summary: where the page is, what was built, what is left.

## Progress

- [x] 2026-11-10: first version built inside the demo CEO panel (tab «فاکتورها»): `src/lib/panel/invoices.ts` (UI + Store), `src/lib/panel/jalali.ts`, sheet/print CSS in `src/app/globals.css` (`.inv-*`).
  Rebuilt from this brief because the desktop project's files (app.js, style.css, logo.png, the printed sample) were not provided: colours/proportions are my reading of the brief, the "SA" logo is a placeholder (drop the real file at `public/invoice/logo.png` and it is used automatically).
  Storage is localStorage (demo) behind a `Store` with the exact API contract; set `window.API_BASE` to talk to the real `/api/*` once the backend exists.
  Not done: server-side auth/CSRF/rate limit/number transaction (needs the backend), import of old invoices (needs the owner's copy of data\), real logo and sample for a pixel-faithful sheet.
