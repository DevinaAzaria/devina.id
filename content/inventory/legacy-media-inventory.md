# Legacy Media Inventory

**Status:** Public-site pass 1  
**Source:** Legacy WordPress site at `https://devina.id`  
**Purpose:** Track media that must be preserved before the WordPress cut-over.

> This is not yet an exhaustive `wp-content/uploads` inventory. It records media references discoverable from the public site and defines the preservation rules for the final media migration pass.

## Media preservation classes

| Class | Meaning |
|---|---|
| **A — Portfolio critical** | Original photos, project evidence, certificates, school/activity documentation, original artwork, or original music-related visuals that support the portfolio narrative. Preserve and migrate. |
| **B — Historical context** | Images tied to retained Journal/Archive posts. Preserve when licensing/provenance is acceptable. |
| **C — Replaceable editorial** | Generic illustrations, screenshots, or stock/editorial images that can be replaced in the new site. Do not depend on them for portfolio evidence. |
| **D — Commerce legacy** | TUNIQUE/WooCommerce product images and old commercial branding. Preserve only in a legacy backup if desired; do not migrate into the personal portfolio. |
| **E — Third-party/copyright-sensitive** | Lyrics artwork, artist imagery, scraped/catalog images, or media whose rights are unclear. Do not migrate publicly unless rights are verified. |

## Public media surfaces discovered

| Legacy surface | Media observed | Class | Migration action |
|---|---|---:|---|
| Homepage `/` | Devina & Co. hero/background imagery, including `cloudss.jpg` surfaced publicly | C / D | Do not carry into portfolio identity. Preserve only in legacy backup if needed. |
| `/shop/` and WooCommerce products | Product photography for TUNIQUE items | D | Exclude from new portfolio. Preserve only as historical commerce backup. |
| `/devina-co/` | Devina & Co. business branding/images | D | Exclude from personal portfolio. |
| Blog posts 2022–2026 | Featured images attached to articles | B / C / E | Decide article-by-article after provenance review. |
| `Belajar Coding Belajarnya di Mana ya?` | Featured image shown on legacy article | B | Candidate to preserve if original/licensed; article itself is high-value historical learning evidence. |
| `Manfaat belajar coding sejak dini` | Featured image shown on legacy article | B | Same treatment as coding journey material. |
| `Produk Adobe Creative Cloud` | Featured/illustrative image | C | Replaceable; article may be archived rather than featured. |
| `Circumference` | Formula/diagram images used inside article | B / C | Preserve only if needed for historical rendering; not portfolio-critical evidence. |
| Taylor Swift lyric pages | Artist/lyrics-related imagery | E | Do not migrate to public portfolio. |
| Fashion/catalog pages | Brand/product imagery | D / E | Do not migrate to personal portfolio. |
| QRIS / finance / SEO / generic explainers | Editorial screenshots or illustrations | C | Usually replace or omit when archived. |

## Portfolio-critical media still to identify

Before WordPress deletion, explicitly search `wp-content/uploads` and old Pages for:

- Devina's original project screenshots;
- coding/course/project progress evidence;
- certificates and competition documentation;
- school, culture, music, and performance photos that are intended for public portfolio use;
- original artwork/design assets;
- original audio artwork where Devina owns or controls rights;
- profile photographs chosen for the new portfolio;
- any file linked from a retained article but not obvious from the public page.

## File-handling policy for the Astro portfolio

Preferred destination:

```text
public/
└── media/
    ├── projects/
    ├── achievements/
    ├── journal/
    ├── music/
    ├── culture/
    └── profile/
```

Rules:

1. Use descriptive, lowercase filenames with hyphens.
2. Avoid carrying WordPress-generated size variants unless required.
3. Keep one high-quality source image plus web-optimized derivatives only when useful.
4. Record original publication date/context in content metadata rather than filename hacks.
5. Do not publish images containing private identifiers, addresses, account data, or unnecessary personal information.
6. Do not migrate third-party copyrighted images merely because they existed on the old blog.
7. Original evidence should be favored over decorative stock imagery.

## Cut-over requirement

The final media pass requires either:

- a filesystem copy/listing of `wp-content/uploads`, or
- a WordPress export/API/media listing that exposes the attachment library.

Until that pass is complete, **do not delete `wp-content/uploads` or the WordPress database**.
