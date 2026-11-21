/* eslint-disable @typescript-eslint/no-require-imports */
/* Builds the printable price-list PDFs from the real site (same data and design).
 * Usage: npm run build && npx next start -p 3099 &  then  node tools/make-price-pdf.js http://localhost:3099
 * Output: public/price-lists/instagram-packages-{fa,en}.pdf */
const { chromium } = require("playwright");
const fs = require("fs");
const base = process.argv[2] || "http://localhost:3099";
(async () => {
  fs.mkdirSync("public/price-lists", { recursive: true });
  const b = await chromium.launch();
  for (const lang of ["fa", "en"]) {
    const pg = await b.newPage({ viewport: { width: 900, height: 1200 } });
    await pg.goto(`${base}/${lang}/price-list/instagram`, { waitUntil: "networkidle" });
    await pg.evaluate(() => document.fonts.ready);
    await pg.pdf({ path: `public/price-lists/instagram-packages-${lang}.pdf`, format: "A4", printBackground: true, preferCSSPageSize: true });
    await pg.close();
  }
  await b.close();
})();
