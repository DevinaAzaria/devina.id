# Cloud migration plan — devina.id → Cloudflare Pages

Status: **pre-cutover staging**

Scope: migrate only the public apex website `devina.id` and `www.devina.id` from the current origin hosting to Cloudflare Pages. Existing subdomains and other services remain on their current infrastructure until they are migrated separately.

## Why the target is Cloudflare Pages

The preflight audit showed that `devina.id` already uses Cloudflare as its authoritative DNS provider. The website origin remains on the existing hosting provider.

That makes Cloudflare Pages the cleaner migration target for the public Astro site:

- no nameserver migration is required;
- existing MX/TXT records remain untouched;
- unrelated subdomains remain untouched;
- the apex site can move from the old origin to Pages inside the same Cloudflare zone;
- there is no need to stack Cloudflare in front of another CDN;
- Pages supports GitHub deployments and pull-request previews for Astro.

## Target architecture

```text
DevinaAzaria/devina.id (public GitHub source)
              |
              | merge / push
              v
       Cloudflare Pages
              |
              v
       devina.id + www

archive.devina.id ─┐
hq.devina.id      ─┤
OLS / CIYUS etc.  ─┼── existing DNS/origin targets
other subdomains  ─┤
mail records      ─┘
```

The private `DevinaAzaria/devina-editorial` publisher continues to publish approved content into the public GitHub repository. Cloudflare Pages then builds the public repository.

## Preflight findings

The October 2026 migration preflight confirmed:

- authoritative DNS is already Cloudflare;
- the apex site is currently served through Cloudflare;
- `archive.devina.id` and `hq.devina.id` are live independently;
- MX and TXT records exist and must not be modified during website cutover;
- Google site verification already exists at DNS/TXT level;
- `/BingSiteAuth.xml` and `/ads.txt` currently return HTTP 200 and must be preserved if still required;
- direct directory access to `/.well-known/` returns 403, so any non-certificate content there should be checked before final cutover;
- several historically named subdomains currently have no public DNS response. They must not be invented or changed merely because they appeared in older portfolio documentation.

## Cloudflare Pages build settings

When creating the Pages project:

- Repository: `DevinaAzaria/devina.id`
- Production branch: `main`
- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`

## Routing parity

The current Apache `.htaccess` serves real Astro routes first and redirects unknown legacy paths to the same path on `archive.devina.id`.

Cloudflare Pages' `_redirects` file cannot safely reproduce that exact catch-all because redirect rules execute even when a static asset exists.

Instead, this migration uses `public/_worker.js` in Pages advanced mode:

1. serve the requested static asset through the Pages `ASSETS` binding;
2. if the result is a 404 for GET/HEAD, redirect to the same path and query on `https://archive.devina.id`;
3. redirect `www.devina.id` to the apex while preserving path/query;
4. attach the existing security headers;
5. add `X-Robots-Tag: noindex, nofollow` on `*.pages.dev` preview hosts so previews do not compete with the canonical public site.

Do not add aggressive custom cache rules. Cloudflare Pages already manages static asset caching.

## Critical pre-cutover checks

Do **not** attach the apex domain until all of these are true:

- Pages preview deployment builds successfully from GitHub.
- Home, About, Achievements, Research & Writing, Journal, sitemap, robots, favicon, and representative article routes work.
- A deliberately missing/legacy path redirects to the corresponding `archive.devina.id` path.
- Preview deployments return `X-Robots-Tag: noindex, nofollow`.
- Security headers are present.
- Canonical URLs still point to `https://devina.id`, not `*.pages.dev`.
- `archive.devina.id` remains reachable.
- Current DNS records are snapshotted.
- `BingSiteAuth.xml` and `ads.txt` are either migrated or intentionally retired after confirming they are no longer required.
- Any important non-ACME content under `/.well-known/` is identified.
- Mail-related records (MX/SPF/DKIM/DMARC) remain unchanged.
- Existing application subdomains remain unchanged.

## Custom-domain cutover

Because `devina.id` is already a Cloudflare zone, use the Pages project's **Custom domains** flow rather than manually guessing DNS targets.

Recommended sequence:

1. Create the Pages project and deploy to its `*.pages.dev` hostname.
2. Test the Pages hostname thoroughly.
3. In Workers & Pages → project → Custom domains, add `devina.id`.
4. Add `www.devina.id` as a second custom domain.
5. Allow Cloudflare to create/update only the records required for those two hostnames.
6. Do not modify MX/TXT records or unrelated subdomain records.
7. Verify the apex and www custom domains show Active.
8. Verify production HTTPS, canonical, sitemap, robots, images, redirects, and representative pages.
9. Verify archive/HQ/other active subdomains remain on their previous destinations.
10. Keep the old FTPS deployment available as rollback until the Pages deployment has completed a normal publishing cycle.

## Rollback

Before attaching the custom domain, record the existing apex and www DNS record values from the Cloudflare DNS dashboard.

If cutover is unhealthy:

1. restore the recorded apex/www DNS records to the previous origin;
2. leave all unrelated DNS records untouched;
3. confirm the old FTPS-produced site responds;
4. troubleshoot the Pages deployment on its `*.pages.dev` hostname.

## Post-cutover cleanup

Only after the cloud deployment is stable:

- remove the FTPS deploy step from `.github/workflows/production-deploy.yml`;
- retain GitHub CI/build verification;
- remove obsolete FTP secrets if they are no longer used by any workflow;
- decide whether the old host should retain a static fallback copy;
- keep `archive.devina.id` on the old host until its own migration is planned.
