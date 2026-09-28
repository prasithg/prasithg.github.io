VERDICT: FIX-FIRST

SCORES (1-10): first-viewport 8, typography 8, restraint 6, mobile 7, 60s-trust 6, voice 7

LARGEST GAP: The Parker teaser gives the strongest project prominent screen space for a simulated comparison instead of verifiable product behavior, weakening the “real software” thesis.

  evidence: `index.html:405–411` stages a generic assistant sending the wrong message beneath “Most assistants guess,” then presents Parker’s preferred response. That comparison is unsupported and conflicts with the brief’s no-fake-UI rule. `preview/v3/home-desktop.png` shows the teaser displacing the next project below the first viewport. The synthetic-demo label is clear; the evidence remains simulated.

  fix: Remove the synthetic teaser from the Parker card and its teaser-only log row. Restore that space when an actual session recording can show repair, confirmation, and caregiver review.

NEXT 3 (smaller, ranked):

1. **The new notes skip the receipts step.** `notes/a-check-that-could-not-run-said-red.html:165` gives exact times and probe counts without a linked diff or output; attach a sanitized incident receipt and cut the manufactured “not calling it a law” closing hedge. `notes/picking-the-colors-before-the-model-does.html:165` needs links to its brief and quoted commenter, or removal of the unattributed quotation.
2. **Mobile Notes dates run into titles.** `index.html:294` retains `grid-column: 2` after `index.html:321` switches to one column, creating an implicit second column with almost no gap. This is visible in `preview/v3/home-mobile.png`. Reset the summary’s column placement inside the mobile rule so date, title, and summary stack.
3. **Two log rows exceed their evidence precision.** `index.html:475` links “26 distilled playbooks” to a moving commit listing; pin the counted snapshot. `index.html:477` says conversation “never waits”; replace the absolute with the specific background operation moved off the voice path.

DO-NOT-CHANGE: The locked hero, portrait, nav, and section order. Both first viewports retain immediate meaning. Keep the coherent note typography, useful rail/footer links, self-hosted fonts, transcript pattern, and intentional review gate. No new company deal details surfaced.

Verification: 14 tests passed; contract and render checks passed; text tokens meet AA contrast. Publish blocking is expected. External GitHub receipts could not be independently fetched.