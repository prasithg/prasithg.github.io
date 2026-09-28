VERDICT: FIX-FIRST

SCORES (1-10): first-viewport 8, typography 9, restraint 8, mobile 9, 60s-trust 7, voice 7

LARGEST GAP: The new memory incident is presented as a receipt, but gives strangers no way to verify its precise recovery claims.

  evidence: `index.html:483` links to `notes/a-check-that-could-not-run-said-red.html:165`, which asserts timestamps, exit-code changes, 26/26 recall, and 12/12 fleet recovery without a linked patch, test, or incident record. The claim and lesson are clear; the receipts are missing. This directly weakens “Receipts only.”

  fix: Add one compact evidence paragraph linking the versioned fix and a public-safe before/after test record supporting those counts. If those cannot be published, hold this note and its log row.

NEXT 3 (smaller, ranked):

1. `index.html:416`: “Most assistants guess” introduces an unsupported competitor comparison. Remove that assertion from the teaser and transcript; show Parker’s confirmation behavior.
2. `notes/notes.json:5` and `notes/picking-the-colors-before-the-model-does.html:165`: “Every Opus product video” and “‘Clean and modern’ gets you the purple video” turn observation into certainty. Scope both to examples actually seen; the specific palette and timing rules already carry the lesson.
3. `index.html:339`: The later `scroll-behavior: smooth` overrides the reduced-motion `auto` rule. Move the default above the media query. This is inherited, but still present.

DO-NOT-CHANGE: Keep the locked hero, portrait, navigation, and section order. Both first viewports communicate immediately. The collapsed teaser is no longer my largest gap; retain its caveat and transcript. Keep the shared notes typography, corrected mobile stacking, quiet functional rail/footer links, and intentional review gate.

Verification: `python3 -B -m unittest discover -s tests -v` passed all 14 tests; contract and render `--check` passed. Publish checking blocked only expected pending markers. Calculated text-token contrasts pass AA; supplied screenshots show coherent wrapping. External receipt contents could not be independently fetched. No new company deal or partner disclosures found.