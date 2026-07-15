# prasithg.com

Personal site for Prasith Govin — startup CTO, agent builder, and co-founder of [JobLeap AI](https://jobleap.ai).

## Local development

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run check
npm run build
npm test
```

## Project posture

- Astro static site; no client framework.
- Dark-first, responsive homepage with a user-selectable light theme.
- Public-facing strings are centralized in `src/data/site.ts` and covered by release tests.
- Homepage copy and links must stay public-safe and evidence-backed.
- Do not add invented metrics, testimonials, or unpublished claims.
- Deployment, analytics, and DNS changes require explicit approval.

## Deployment

The `main` branch deploys to [prasithg.github.io](https://prasithg.github.io/) through the pinned GitHub Pages workflow in `.github/workflows/deploy.yml`. The workflow runs Astro diagnostics and tests before publishing. No custom domain is configured.

See [`docs/plans/2026-07-14-prasithg-homepage-v1.md`](docs/plans/2026-07-14-prasithg-homepage-v1.md) for the current plan.
