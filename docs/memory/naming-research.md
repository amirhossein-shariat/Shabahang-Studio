# Service naming — research and decisions (2026-11-09)

The owner asked to benchmark well-known sites and improve the service names.

## What could be checked
- Direct fetches of pentagram.com, ibm.com/consulting, ideo.com, hidokmeh.com and en.part.ir **failed**: those hosts are outside
  this cloud session's allowed network domains. They would have to be allowed before they can be read.
- Two web searches worked and gave these findings:
  - Accenture Song (global design + technology group) describes its creative work as branding, graphic design, UI/UX design,
    motion graphics and video production — plain discipline names, not slogans.
    Source: https://passionates.com/?p=60789
  - Persian digital-agency sources group services as website design and development, SEO, social media management,
    content marketing, branding and visual design (logo, catalogue, banners) and consulting. **IT support does not appear as an
    agency category at all**, so naming it plainly is what makes the studio's difference visible.
    Source: https://blog.faradars.org/آژانس-دیجیتال-مارکتینگ/
- Limits: this is two searches, not a survey. Re-run it with direct site access before treating the names as final.

## Naming rules adopted
1. Use the words clients type into a search box ("طراحی سایت", "پشتیبانی IT", "شبکه‌های اجتماعی"), not internal jargon ("رشد", "زیرساخت").
2. A discipline name, not a slogan; the slogan lives in the one-line tagline under it.
3. Same names everywhere: home cards, services page, contact topics, packages (all read `src/data/services.ts`).

## Old → new
| Old (brief) | New fa | New en |
|---|---|---|
| برند و هویت / Brand | برندینگ و هویت بصری | Branding & Visual Identity |
| سایت و نرم‌افزار / Web & Software | طراحی سایت و اپلیکیشن | Web & App Development |
| محتوا و رشد / Content & Growth | شبکه‌های اجتماعی و محتوا | Social Media & Content |
| IT و زیرساخت / IT & Infrastructure | پشتیبانی IT و شبکه | IT Support & Networks |
| طراحی محصول / Product Design | طراحی محصول (unchanged) | Product Design (unchanged) |

Other labels: header CTA «بیا حرف بزنیم» → «درخواست مشاوره» (EN "Get in touch"); package button → «دریافت مشاوره‌ی این بسته».
The taglines (دیده شو، آنلاین شو …) are unchanged. Names are data, so they can be changed in one place.
