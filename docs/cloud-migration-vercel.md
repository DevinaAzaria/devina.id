# Cloud migration plan — devina.id → Vercel

Status: **pre-cutover staging**

Scope: migrate only the public apex website `devina.id` and `www.devina.id` to a cloud static host. Existing subdomains and other services remain on the current hosting provider until they are migrated separately.

## Target architecture

```text
DevinaAzaria/devina.id (public GitHub source)
              |
              | merge / push
              v
         Vercel build
              |
              v
       devina.id + www

archive.devina.id ─┐
music.devina.id   ─┤
hq.devina.id      ─┤
other subdomains  ─┼── current hosting / current DNS targets
                   └── unchanged
```

The private `DevinaAzaria/devina-editorial` publisher continues to publish approved content into the public GitHub repository. Vercel then builds the public repository.

## Why Vercel for this migration

The public site is a static Astro site and does not require a PHP/Apache runtime. Vercel can build directly from the GitHub repository and provides preview deployments before DNS cutover.

This migration intentionally **does not move the authoritative DNS nameservers**. The existing DNS provider can remain in place. Only the records for the apex website and `www` should be changed during cutover.

## Build contract

- Framework: Astro
- Build command: `npm run build`
- Output directory: `dist`
- Node: use Vercel's current supported Node 22 runtime where available
- Public URL remains `https://devina.id`
- Canonicals, sitemap, and structured data continue to use `https://devina.id`

## Apache → cloud routing translation

The current Apache `.htaccess` does three important things:

1. serves real Astro files/routes;
2. applies security/cache headers;
3. redirects unknown legacy paths to the same path on `https://archive.devina.id/`.

`vercel.json` reproduces that behavior for preview testing:

- filesystem routes are served first;
- missing paths fall through to a 301 redirect on `archive.devina.id`;
- security headers are set globally;
- generated assets receive long cache headers;
- normal image files receive a 30-day browser cache.

The fallback rule must be tested on a real Vercel preview before DNS cutover.

## Critical pre-cutover checks

Do **not** change DNS until all of these are true:

- Vercel preview build succeeds from the public GitHub repository.
- Home, About, Achievements, Research & Writing, Journal, sitemap, robots, favicon, and representative article routes work.
- A deliberately missing/legacy route redirects to the corresponding `archive.devina.id` path.
- Security headers are present.
- Canonical URLs still point to `https://devina.id`, not the preview hostname.
- `archive.devina.id` remains reachable.
- Current DNS records are snapshotted.
- Current verification files at the old apex are inventoried.
- Any Google/Bing verification file still required after cutover is copied into the public repository or replaced with DNS verification.
- Mail-related records (MX/SPF/DKIM/DMARC) and non-apex subdomains are left unchanged.
- A rollback value for the old apex DNS record is recorded before cutover.

## DNS cutover principle

Only change records that serve the public website:

- `devina.id`
- `www.devina.id`

Do not change:

- MX records
- SPF/DKIM/DMARC records
- `archive.devina.id`
- `music.devina.id`
- `hq.devina.id`
- OLS/KERSAA-related hostnames
- PLOOS
- CIYUS
- Pulse
- other application/service subdomains

Use the exact DNS values Vercel shows in the project's Domains screen. Do not hard-code an address from a guide because Vercel may provide project-specific instructions.

## Cutover sequence

1. Connect/import the GitHub repository into Vercel.
2. Deploy to the Vercel-generated preview/production hostname **without attaching devina.id yet**.
3. Run route/header/SEO checks against the Vercel hostname.
4. Add `devina.id` and `www.devina.id` to the Vercel project.
5. Record the old apex and www DNS values for rollback.
6. Change only apex/www DNS records at the existing DNS provider.
7. Verify HTTPS, canonical tags, sitemap, robots, redirects, images, and representative pages.
8. Verify every legacy subdomain still resolves to its old destination.
9. Monitor for at least one normal publishing cycle.
10. Only after stability, retire the FTPS deployment step for the apex website.

## Rollback

If the cloud cutover is unhealthy:

1. restore the recorded old apex/www DNS values;
2. keep the FTPS deployment workflow available during the migration window;
3. confirm the old production site responds again;
4. investigate the cloud deployment without touching unrelated subdomains.

## Post-cutover cleanup

After the cloud deployment has been stable:

- remove FTPS deployment from `.github/workflows/production-deploy.yml`;
- retain CI/build verification in GitHub;
- remove obsolete FTP repository secrets from the public repo if they are no longer used anywhere;
- decide whether the old hosting should keep a static fallback copy of the apex site;
- keep `archive.devina.id` on the old hosting until the legacy archive has its own migration plan.
