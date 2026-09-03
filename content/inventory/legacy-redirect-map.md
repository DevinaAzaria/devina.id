# Legacy URL Redirect Map

**Status:** Draft / public audit pass 1  
**Source:** Legacy WordPress `devina.id`  
**Target:** New Astro portfolio  
**Goal:** Prevent valuable historical URLs from silently disappearing during cut-over.

## Redirect policy

- **301** for legacy content that has a clear permanent destination.
- **410** may be preferable for intentionally retired low-value/third-party content when there is no meaningful replacement.
- Avoid sending every removed URL to the homepage; that creates poor semantic redirects.
- Preserve original URLs in this map even when a final destination has not yet been created.

## High-value candidate redirects

| Legacy URL | Proposed new destination | Status | Rationale |
|---|---|---|---|
| `/belajar-coding-belajarnya-di-mana-ya/` | `/journal/coding-journey/` or dedicated historical article | **Keep / design target** | Strong early coding-learning evidence from 2022. |
| `/manfaat-belajar-coding-sejak-dini/` | `/journal/coding-journey/` | **Keep / consolidate** | Fits early coding journey; may be consolidated while retaining source date. |
| `/silabus-belajar-coding-usia-13-tahun-hingga-kuliah/` | `/projects/coding-learning-roadmap/` | **Portfolio candidate / verify** | Strong developmental learning-system evidence if provenance is confirmed. |
| `/silabus-belajar-coding-untuk-usia-15-16-tahun/` | `/projects/coding-learning-roadmap/` | **Portfolio candidate / verify** | Part of coding roadmap series. |
| `/silabus-belajar-coding-untuk-usia-16-17-tahun/` | `/projects/coding-learning-roadmap/` | **Portfolio candidate / verify** | Part of coding roadmap series. |
| `/silabus-belajar-coding-usia-17-18-tahun/` | `/projects/coding-learning-roadmap/` | **Portfolio candidate / verify** | Part of coding roadmap series. |
| `/memahami-peran-kecerdasan-buatan-ai-di-masa-depan/` | `/journal/technology/` or retained article slug | **Keep / verify** | Early technology reflection. |
| `/kecerdasan-buatan-artificial-intelligence-ai-definisi-jenis-penerapan-dan-tantangan-etis/` | `/journal/technology/` | **Keep / consolidate** | Explanatory AI content; avoid presenting as original research. |
| `/memahami-digital-services-act-menata-ulang-dunia-digital-untuk-keamanan-dan-keadilan/` | `/journal/digital-literacy/` | **Keep / verify** | Digital literacy history. |
| `/7-kebiasaan-digital-yang-dianggap-sepele-tapi-bisa-bermasalah-secara-hukum/` | `/journal/digital-literacy/` or retained article slug | **Keep / verify** | Recent writing with digital-literacy relevance. |
| `/evolusi-desain-kebaya-dari-tradisional-ke-sentuhan-modern/` | `/culture/` or `/journal/culture/` | **Keep / verify** | Potentially relevant to culture portfolio. |
| `/lirik-lagu-kita-sama-rasa/` | `/music/` only if original authorship is verified | **Hold** | Do not redirect/publish as personal work until provenance is clear. |

## Archive-oriented redirects

| Legacy URL | Proposed destination | Status |
|---|---|---|
| `/produk-adobe-creative-cloud/` | `/archive/` or no public migration | Archive |
| `/cara-menghapus-cache-di-laptop-windows-10-11-dan-macos/` | `/archive/` or no public migration | Archive |
| `/pengertian-fitur-dan-cara-menggunakan-canva/` | `/archive/` | Archive |
| `/panduan-membuat-konten-berkualitas-dan-menarik/` | `/archive/` | Archive |
| `/target-content-writer/` | `/archive/` | Archive / provenance review |
| `/sistem-pembayaran-digital-standar-indonesia-qris/` | `/archive/` | Archive |
| `/the-circumference/` | `/archive/learning-notes/` | Archive / possible early STEM note |
| `/0-km-coffee-tea-kafe-baru-di-titik-0-km-yogyakarta/` | `/archive/` | Archive |
| `/mengenal-jenis-jenis-espresso/` | `/archive/` | Archive |
| `/jakarta-fashion-week/` | `/archive/` or `/journal/culture/` after relevance review | Archive / Review |

## Intentionally retired surfaces

| Legacy URL / pattern | Proposed action | Reason |
|---|---|---|
| `/shop/` | Retire; likely 410 or a concise legacy notice during transition | WooCommerce/TUNIQUE commerce is outside the personal portfolio. |
| `/product/*` | Retire | Product catalogue should not pollute academic portfolio routing. |
| `/product-category/*` | Retire | Obsolete commerce taxonomy. |
| `/cart/`, `/checkout/`, `/my-account/` | Retire | WooCommerce transaction surfaces no longer needed. |
| `/how-to-order/` | Retire | Commerce instruction page. |
| `/return-or-exchange-policy/` | Retire | Commerce policy page. |
| `/devina-co/` | Retire or historical note only | Old umbrella/business concept conflicts with new personal portfolio identity. |
| Taylor Swift / third-party lyric URLs such as `/ready-for-it/`, `/song-lyrics-long-live-taylor-swift/` | Retire; do not migrate copyrighted lyrics | Third-party copyrighted content and low portfolio value. |
| Generic recipes / catalog dumps / affiliate content | Retire | Low relevance to target portfolio. |

## Existing utility/public files to preserve separately

These are not handled by normal page redirects and must be checked in hosting before cut-over:

- `/.well-known/`
- Google site verification file(s)
- Bing verification file(s)
- `ads.txt` — decide whether still required; likely not for the new portfolio
- `cgi-bin/` — hosting utility; leave unless host says otherwise
- any legacy `robots.txt` / sitemap configuration

## Implementation target

For static hosting, redirects may need to be implemented at the web-server layer (for example `.htaccess` under Apache/DirectAdmin) because Astro static pages alone do not issue server-side 301 responses.

A future migration pass should generate a production redirect configuration from this document after final destination routes exist.

## Gate

Do **not** deploy redirects yet. Destination pages and the full legacy URL inventory are not complete.
