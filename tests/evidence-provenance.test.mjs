import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const catalogModule = new URL('../src/data/evidence.ts', import.meta.url);
const workIndex = await readFile(new URL('../dist/work/index.html', import.meta.url), 'utf8');
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_AGE_DAYS = 30;
const IMMUTABLE_PUBLIC_SOURCE = /github\.com\/[^/]+\/[^/]+\/(?:commit\/[0-9a-f]{40}|actions\/runs\/\d+|blob\/[0-9a-f]{40}\/)/i;
const LOCAL_BOUNDARY = 'Local-only evidence. No public source revision exists.';

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function cardFor(href) {
  const escapedHref = escapeRegExp(href);
  const match = workIndex.match(new RegExp(`<article class="work-card"[^>]*>[\\s\\S]*?href="${escapedHref}"[\\s\\S]*?<\\/article>`, 'i'));
  assert.ok(match, `missing rendered card for ${href}`);
  return match[0];
}

test('every evidence note carries a current verification date and an explicit source boundary', async () => {
  const { evidenceCatalog } = await import(catalogModule);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (const note of evidenceCatalog) {
    const provenance = note.provenance;
    assert.ok(provenance, `${note.href} is missing provenance`);
    assert.match(provenance.verifiedOn, /^\d{4}-\d{2}-\d{2}$/, `${note.href} has an invalid verification date`);

    const verifiedOn = new Date(`${provenance.verifiedOn}T00:00:00Z`);
    assert.ok(Number.isFinite(verifiedOn.valueOf()), `${note.href} has an invalid verification date`);
    const ageDays = Math.floor((today.valueOf() - verifiedOn.valueOf()) / DAY_MS);
    assert.ok(ageDays >= 0, `${note.href} verification date is in the future`);
    assert.ok(ageDays <= MAX_AGE_DAYS, `${note.href} provenance is stale at ${ageDays} days`);

    if (provenance.kind === 'public') {
      assert.match(provenance.href, IMMUTABLE_PUBLIC_SOURCE, `${note.href} public provenance is not an exact immutable source pointer`);
      assert.ok(provenance.label.trim(), `${note.href} public provenance needs a source label`);
    } else {
      assert.equal(provenance.kind, 'local', `${note.href} has an unknown provenance kind`);
      assert.equal(provenance.boundary, LOCAL_BOUNDARY, `${note.href} local provenance boundary drifted`);
      assert.equal('href' in provenance, false, `${note.href} local provenance must not expose a public source URL`);
    }
  }
});

test('every work card renders its verification date and exact source or local-only boundary', async () => {
  const { evidenceCatalog } = await import(catalogModule);

  for (const note of evidenceCatalog) {
    const card = cardFor(note.href);
    assert.match(card, new RegExp(`<time[^>]+datetime="${note.provenance.verifiedOn}"`, 'i'), `${note.href} does not render its verification date`);

    if (note.provenance.kind === 'public') {
      assert.match(card, new RegExp(`href="${escapeRegExp(note.provenance.href)}"`, 'i'), `${note.href} does not render its exact public source`);
      assert.match(card, /target="_blank"[^>]*rel="noopener noreferrer"|rel="noopener noreferrer"[^>]*target="_blank"/i, `${note.href} public source link is not safely opened`);
    } else {
      assert.match(card, new RegExp(escapeRegExp(note.provenance.boundary), 'i'), `${note.href} does not render its local-only boundary`);
    }
  }
});
