# prasithg.com homepage v1 — 2026-07-14

## Goal

Launch a durable personal home base for Prasith Govin that communicates hands-on startup CTO credibility, practical agent-building work, and the Parker assistive-AI mission in under 20 seconds.

## Done when

- The homepage clearly identifies Pras as a startup CTO and agent builder.
- The first viewport has a human portrait, a concise positioning statement, current-work signals, and direct paths to public work.
- Parker, agent supervision, and JobLeap are represented with factual public-safe copy and real links.
- The design preserves the reference site's warm minimalism, technical working-log energy, and spaciousness without copying its layout or styling.
- Desktop and mobile layouts render without clipping, console errors, broken links, or inaccessible controls.
- `npm run build` and `npm run check` pass.

## Context

- New Astro repository at `~/Development/personal/prasithg.com`.
- Reference: `https://www.uzairansar.com/`.
- Existing strategy material: `~/Development/personal-brand/website/`.
- Public source links:
  - GitHub: `https://github.com/prasithg`
  - LinkedIn: `https://www.linkedin.com/in/prasithg`
  - X: `https://x.com/prasithg`
  - Parker: `https://github.com/prasithg/parker`
  - Claude Desktop Supervisor: `https://github.com/prasithg/claude-desktop-supervisor`
  - JobLeap: `https://jobleap.ai`

## Locked direction

- Astro static site with no client framework.
- Warm paper palette, dark green-black ink, cobalt and coral utility accents.
- Human portrait rail + editorial hero + monospaced build log.
- One homepage first; notes/content collections and deployment follow after copy/design review.
- No invented metrics, testimonials, client logos, or unpublished project claims.
- No deployment or DNS changes in this phase.

## T1 — Establish the original visual system

Depends on: none  
Objective: Translate the reference's human + technical feel into a distinct Pras system.  
Files: `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `public/favicon.svg`  
Acceptance:
- Tokens cover light/dark surfaces, type, spacing, borders, focus, and motion.
- Layout is responsive from 360px to wide desktop.
- Reduced-motion and visible focus states are present.

## T2 — Build the first-viewport identity surface

Depends on: T1  
Objective: Make role, point of view, current work, and social proof scannable in 20 seconds.  
Files: `src/components/SiteNav.astro`, `src/components/PortraitCard.astro`, `src/components/BuildLog.astro`, `src/pages/index.astro`, `public/prasith-govin.jpg`  
Acceptance:
- Hero says “Startup CTO / Agent builder.”
- Copy is first-person, concrete, and public-safe.
- Portrait and all social links load.
- Theme preference persists locally.

## T3 — Add proof-of-work sections

Depends on: T2  
Objective: Ground the positioning in Parker, agent operations, JobLeap, and writing plans.  
Files: `src/components/ProjectCard.astro`, `src/pages/index.astro`  
Acceptance:
- Every live CTA points to an existing public URL or a valid page anchor.
- Parker is the featured project.
- “Field notes” is clearly labeled as forthcoming, not represented as published work.

## T4 — Verify and prepare iteration

Depends on: T3  
Objective: Prove the implementation is buildable and visually coherent.  
Files: `README.md`, project source as needed  
Acceptance:
- `npm run check` passes.
- `npm run build` passes.
- Desktop and mobile screenshots show no clipping or unintended horizontal overflow.
- Browser console is clean.

## Later phases

- Replace the current public GitHub portrait with a purpose-shot high-resolution portrait.
- Add Astro content collections for field notes and project case studies.
- Add an About/Now page with the enterprise CTO → startup CTO arc.
- Configure analytics, social cards, domain DNS, and deployment only after explicit approval.
