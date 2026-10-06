# Security and Public Repository Boundary

`DevinaAzaria/devina.id` is intentionally a **public publishing repository**.

## Public by design

This repository may contain:

- the source code for devina.id;
- layouts, styles, build scripts, and deployment configuration that do not contain credentials;
- published portfolio pages and published writing;
- public evidence links and public-facing media;
- public editorial standards such as portfolio governance and SEO rules.

## Never commit here

Do not commit:

- passwords, API keys, access tokens, private keys, certificates, or credential files;
- `.env` files or private local configuration;
- raw CV/source dossiers or private evidence-review notes;
- unpublished editorial drafts;
- private editorial calendars;
- migration inventories containing internal decisions or provenance-review notes;
- private student identifiers, home address, private phone number, signatures, administrative QR/barcodes, or real-time location.

Private editorial material belongs in the separate private editorial repository.

## Authorship and provenance

Publishing remains subject to the portfolio governance rules. AI, parent, mentor, DevinaHQ, or other assistance must not be presented as Devina's independent work.

## Automated guard

`npm run validate:public-security` scans the checked-out repository for common credential files, private-key markers, common token formats, and likely literal credential assignments.

This is a preventive layer, not a replacement for GitHub secret scanning, careful review, or credential rotation after a real leak.

## If sensitive material is ever committed

1. Rotate or revoke credentials first.
2. Remove the material from the current branch.
3. Assess Git history and every live ref.
4. Rewrite/purge history when necessary.
5. Treat cached copies or forks as potentially persistent.
