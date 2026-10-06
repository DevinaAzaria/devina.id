# SEO Writing Standard — devina.id

This is the house standard for new work published under **Research & Writing**. It is based primarily on current Google Search Central guidance and W3C image accessibility guidance.

The goal is not to manufacture rankings. The goal is to make authentic work easy for readers and search engines to understand, discover, verify, and navigate.

## 1. People-first content comes first

SEO is applied to content that is worth publishing even if search traffic did not exist.

A new article should:
- answer a real reader question or document real work;
- add original explanation, experience, evidence, examples, or synthesis;
- avoid rewriting search results without additional value;
- not target an arbitrary word count;
- not repeat keywords to hit a density target;
- not create a new topic only because a keyword appears popular.

For portfolio content, preserve the distinction between Devina's own work, editorial or technical assistance, and mentoring.

## 2. Search intent and topic framing

Before drafting:
- define one primary reader intent;
- define one primary topic phrase and several natural related phrases;
- decide what the reader should know or be able to do after reading;
- identify first-party evidence or experience Devina can legitimately contribute.

Use the primary topic naturally in the page title, H1, opening context, and at least one descriptive subheading only when it reads naturally. Do not force exact-match repetition.

## 3. Title, H1, and meta description

- Each page has one clear, unique page title.
- Each article has one visible H1 that accurately describes the content.
- The H1 and title may be similar, but neither should be clickbait.
- The meta description is a concise, page-specific summary written for people deciding whether to visit.
- There is no Google-mandated character count. Keep titles and descriptions concise enough to remain useful when truncated.

Do not use a `meta keywords` tag. Google Search does not use it.

## 4. URL and slug

New writing uses a stable descriptive URL.

Preferred pattern:

`/research-writing/<category>/<short-descriptive-slug>/`

Slug rules:
- lowercase;
- Latin ASCII where practical;
- words separated with hyphens;
- no spaces or underscores;
- no random IDs;
- avoid dates unless the date is essential to the identity of the work;
- keep it concise and stable after publication.

Example:

`/research-writing/articles-explainers/canva-pengertian-fungsi-materi-dasar/`

A keyword in a URL is not treated as a shortcut to ranking; the slug is primarily for clarity and stable navigation.

## 5. Headings and readability

- Use one H1.
- Use H2 for major sections and H3 only where a subsection is genuinely useful.
- Headings should tell a reader what is in the section.
- Break long prose into readable paragraphs.
- Lists, tables, diagrams, or examples should be used when they improve comprehension, not to inflate the page.
- There is no required number of headings and no required article word count.

## 6. Internal links and inbound links

Every published Research & Writing article must have at least one intentional inbound link from the Research & Writing hub. The automated SEO validator enforces this.

Use contextual internal links when they help a reader move to:
- the underlying project;
- a related article, report, lab note, or reflection;
- Devina's About page when authorship/background is relevant;
- evidence, source code, or project output.

Anchor text should describe the destination. Avoid generic anchor text such as "click here" or "baca di sini".

Do not add unrelated internal links merely to increase link count.

## 7. External / outbound links

Link to external sources when they improve verification, context, or usefulness.

Preference order:
1. primary or official source;
2. original research, standard, documentation, institution, or authoritative reference;
3. high-quality secondary source when a primary source is unavailable or not sufficient.

Trusted editorial citations use ordinary links. Do not add `nofollow` to every outbound link by default.

Use `rel="sponsored"` for paid/sponsored links, `rel="ugc"` for user-generated links, and `nofollow` when the site cannot vouch for a destination but must still reference it.

A source link does not replace original explanation.

## 8. Images

Use images only when they add information, evidence, explanation, or useful visual context.

For meaningful images:
- use a standard HTML `<img>` element;
- place the image near relevant text;
- use a short, descriptive filename;
- use an informative contextual `alt` attribute;
- declare width and height to reduce layout shift;
- use high-quality but web-efficient files;
- prefer WebP or AVIF for photographs/illustrations when practical, while keeping supported fallbacks where needed.

Filename example:
- good: `canva-editor-interface-template.webp`
- poor: `IMG_9282.jpg`

Alt text describes the image's meaning in the current context, not a list of SEO keywords.

For purely decorative images, use `alt=""`. Missing `alt` is not acceptable.

For charts or diagrams, the page must also communicate the important information in text; alt text alone is not a substitute for complex data.

## 9. Preferred / social image

When an article has a representative image:
- provide it to the page layout as the preferred image;
- the layout emits `og:image`, `og:image:alt`, Twitter image metadata, and Article `image` structured data;
- for strong article presentation, prepare high-resolution 16:9, 4:3, and 1:1 variants when practical and pass them as structured images.

The image must represent the article; do not use a generic logo as the article image.

## 10. Structured data

New Research & Writing pages use `WritingLayout.astro`, which emits:
- `Article` structured data;
- `BreadcrumbList`;
- `headline`;
- `description`;
- `datePublished`;
- `dateModified`;
- `articleSection`;
- `mainEntityOfPage`;
- optional `author` only when authorship is explicitly attributable;
- optional representative `image`.

Structured data must describe visible page content. It is not used to invent credentials, authorship, reviews, or facts.

## 11. Authorship, assistance, and trust

Where a reader would expect authorship:
- show an accurate byline;
- link the byline to a real profile/about page;
- show an assistance/provenance note when editorial, technical, AI, parent, mentor, or DevinaHQ assistance materially shaped the work.

Do not set Devina as the structured-data author merely because the page is on devina.id. Set an author only when the attribution is accurate and defensible.

## 12. Dates

- `datePublished` is the actual first publication date.
- `dateModified` changes only when the content is meaningfully revised.
- Do not change a date merely to make old content appear fresh.
- ISO 8601 dates are used in metadata.

## 13. Canonical, indexing, sitemap, and discovery

The site layout provides a self-referencing canonical URL and index/follow robots metadata.

The static sitemap generator automatically adds published indexable pages. After publishing an important article:
- confirm it appears in `sitemap.xml`;
- inspect the live URL;
- validate structured data;
- submit/request indexing through Google Search Console when useful.

## 14. Technical validation

`npm run build` runs `scripts/validate-seo.mjs` after the Astro build and sitemap generation.

For pages using `WritingLayout`, CI rejects:
- missing title or meta description;
- wrong/missing canonical;
- missing Article or Breadcrumb structured data;
- missing/extra H1;
- use of meta keywords;
- invalid slug format;
- images without alt, width, or height;
- poorly formatted local image filenames;
- preferred images without `og:image:alt`;
- missing inbound link from Research & Writing;
- missing return link to Research & Writing;
- broken internal directory links.

Some presentation-length and anchor-text issues are warnings rather than failures because Google does not define magic character counts or exact keyword/link quotas.

## 15. Publication checklist

Before merge:
- [ ] Search intent is clear.
- [ ] The work belongs in the selected Research & Writing category.
- [ ] Title and H1 accurately describe the page.
- [ ] Meta description is unique and useful.
- [ ] Slug is short, descriptive, stable, lowercase, and hyphenated.
- [ ] Claims that need evidence use reliable sources.
- [ ] Internal links are genuinely relevant.
- [ ] Research & Writing hub links to the article.
- [ ] Outbound links use descriptive anchor text and trustworthy destinations.
- [ ] Every meaningful image has contextual alt text and descriptive filename.
- [ ] Images declare dimensions and are optimized.
- [ ] Preferred image metadata is configured when an article image exists.
- [ ] Authorship and assistance are stated accurately.
- [ ] Article structured data matches visible content.
- [ ] Build and SEO validation pass.
- [ ] Live page, canonical, sitemap, mobile rendering, and key links are checked after deployment.

## Primary references

- Google Search Central — SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google Search Central — Helpful, reliable, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Search Central — Image SEO best practices: https://developers.google.com/search/docs/appearance/google-images
- Google Search Central — Article structured data: https://developers.google.com/search/docs/appearance/structured-data/article
- Google Search Central — Breadcrumb structured data: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- W3C WAI — Images tutorial and alt decision tree: https://www.w3.org/WAI/tutorials/images/
