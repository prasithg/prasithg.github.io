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

test('Harness Delta publishes the current termination receipt', () => {
  assert.match(evidenceNote, />23 \/ 23<\/dd><span[^>]*>harness tests passed<\/span>/);
  assert.match(evidenceNote, />2 s<\/dd><span[^>]*>termination observation window<\/span>/);
  assert.match(publicText, /receipt 020/i);
});

test('successful overflow and deadline cleanup observes the synthetic descendant gone', () => {
  assert.match(publicText, /synthetic descendant process group was gone/i);
  assert.match(publicText, /after both overflow and deadline/i);
  assert.match(publicText, /process_group_terminated=true/i);
});

test('unconfirmed cleanup becomes bounded metadata instead of an ordinary probe result', () => {
  assert.match(publicText, /probe_termination_unconfirmed/i);
  assert.match(publicText, /exit 126/i);
  assert.match(publicText, /termination_trigger/i);
  assert.match(publicText, /captured output stays empty/i);
});

test('the cleanup field is a hard pre-model blocker', () => {
  assert.match(publicText, /hard parity blocker/i);
  assert.match(publicText, /only when process_group_terminated is exactly true/i);
  assert.match(evidenceNote, />0<\/dd><span[^>]*>model runs executed<\/span>/);
});

test('the note keeps review, portability, and topology limits beside the green local control', () => {
  assert.match(publicText, /independent review is unavailable for this final local slice/i);
  assert.match(publicText, /same UID can still reach all seven protected surfaces/i);
  assert.match(publicText, /cross-platform behavior was not tested/i);
  assert.match(publicText, /no public Harness revision or hosted replay/i);
});

test('homepage and work index expose the current fail-closed termination boundary', () => {
  assert.match(homepage, /Fail-closed Harness probe cleanup/);
  assert.match(homepage, /exit 126 hard blocker/);
  assert.match(workIndex, /23 \/ 23 harness tests/);
  assert.match(workIndex, /cleanup unconfirmed becomes exit 126/i);
  assert.doesNotMatch(publicText, /\b(?:proved production safety|proved cross-platform behavior|ran a valid comparison|found a model winner)\b/i);
  assert.doesNotMatch(publicText, /—|#\w+/u);
});
