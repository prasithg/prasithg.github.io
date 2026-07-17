import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const distRoot = new URL('../dist/', import.meta.url);
const homepage = await readFile(new URL('index.html', distRoot), 'utf8');
const workIndex = await readFile(new URL('work/index.html', distRoot), 'utf8');
const evidenceNote = await readFile(new URL('work/harness-delta/index.html', distRoot), 'utf8');
const publicText = evidenceNote
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z0-9#]+;/gi, ' ');

test('Harness Delta publishes the reviewed bounded-probe receipt', () => {
  assert.match(evidenceNote, />23 \/ 23<\/dd><span[^>]*>harness tests passed<\/span>/);
  assert.match(evidenceNote, />256 KiB<\/dd><span[^>]*>combined output cap<\/span>/);
  assert.match(evidenceNote, />20 s<\/dd><span[^>]*>default probe deadline<\/span>/);
});

test('bounded probes discard hostile output and stop their process group', () => {
  assert.match(publicText, /synthetic descendant process group was gone/i);
  assert.match(publicText, /captured output stays empty/i);
  assert.match(publicText, /exit 124/i);
  assert.match(publicText, /exit 125/i);
});

test('ordinary probes preserve stream identity under one combined budget', () => {
  assert.match(publicText, /stdout and stderr stay separate/i);
  assert.match(publicText, /one combined byte counter covers both streams/i);
  assert.match(publicText, /262,145-byte split-stream control/i);
});

test('the runner still recomputes authority and executes zero models', () => {
  assert.match(publicText, /recomputes parity in memory/i);
  assert.match(publicText, /generation-bound evidence set/i);
  assert.match(evidenceNote, />0<\/dd><span[^>]*>model runs executed<\/span>/);
  assert.match(publicText, /parity gate and runner both return exit 2/i);
});

test('the field note keeps the current negative space visible', () => {
  assert.match(publicText, /same UID can still reach all seven protected surfaces/i);
  assert.match(publicText, /false or unknown observation becomes an exit 126 hard parity blocker/i);
  assert.match(publicText, /cross-platform behavior was not tested/i);
  assert.match(publicText, /no public Harness revision or hosted replay/i);
});

test('the homepage and work index expose the bounded abstention without inflating it', () => {
  assert.match(homepage, /Fail-closed Harness probe cleanup/);
  assert.match(homepage, /exit 126 hard blocker/);
  assert.match(workIndex, /23 \/ 23 harness tests/);
  assert.match(workIndex, /cleanup unconfirmed becomes exit 126/i);
  assert.doesNotMatch(publicText, /\b(?:Harness winner|Harness won|better runtime|production-safe|proved isolation)\b/i);
  assert.doesNotMatch(publicText, /—|#\w+/u);
});
