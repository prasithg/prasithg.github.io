import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const distRoot = new URL('../dist/', import.meta.url);
const homepage = await readFile(new URL('index.html', distRoot), 'utf8');
const evidenceNote = await readFile(new URL('work/harness-delta/index.html', distRoot), 'utf8');
const traceNote = await readFile(new URL('work/trace-to-tripwire/index.html', distRoot), 'utf8');

test('homepage links to the Harness Delta evidence note', () => {
  assert.match(homepage, /href="\/work\/harness-delta\/"/);
  assert.match(homepage, />Read the abstention note</);
});

test('Harness Delta publishes the abstention receipt without a winner claim', () => {
  assert.match(evidenceNote, /<h1[^>]*>\s*Harness Delta\s*<\/h1>/);
  assert.match(evidenceNote, />0<\/dd><span[^>]*>model runs executed<\/span>/);
  assert.match(evidenceNote, />23 \/ 23<\/dd><span[^>]*>harness tests passed<\/span>/);
  assert.match(evidenceNote, />2 s<\/dd><span[^>]*>termination observation window<\/span>/);
  assert.match(evidenceNote, /same UID can still reach all seven protected surfaces/i);
  assert.match(evidenceNote, /Distinct solver identity unavailable/);
  assert.match(evidenceNote, /No model winner exists/);
  assert.match(evidenceNote, /runner recomputes parity in memory/i);
  assert.doesNotMatch(
    evidenceNote,
    /\b(?:(?:Hermes|Codex) (?:won|wins|outperformed)|better runtime|top-ranked|winning model|comparison showed|leaderboard result)\b/i,
  );
  assert.doesNotMatch(evidenceNote, /proved isolation|production-safe/i);
});

test('Harness Delta has route metadata, safe navigation, and a lexical guard', () => {
  assert.match(evidenceNote, /<link rel="canonical" href="https:\/\/prasithg\.github\.io\/work\/harness-delta\/">/);
  assert.match(evidenceNote, /<meta property="og:url" content="https:\/\/prasithg\.github\.io\/work\/harness-delta\/">/);
  assert.match(evidenceNote, /<a class="nav-brand" href="\/#top"/);
  assert.match(evidenceNote, /<a class="nav-contact" href="\/#contact"/);

  const publicText = evidenceNote
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ');
  assert.doesNotMatch(publicText, /—/u);
  assert.doesNotMatch(publicText, /#\w+/);
  assert.doesNotMatch(publicText, /\b(?:delve|tapestry|crucial|furthermore|moreover|revolutionary|game[- ]changing|mind[- ]blowing|next[- ]level)\b/i);
});

test('Trace-to-Tripwire reflects the verified public repository milestone', () => {
  assert.match(traceNote, /Public source milestone/);
  assert.match(traceNote, />25 \/ 25</);
  assert.match(traceNote, />108 files</);
  assert.match(traceNote, />232,991 bytes</);
  assert.match(traceNote, />5 \/ 5</);
  assert.match(traceNote, /https:\/\/github\.com\/prasithg\/trace-to-tripwire/);
  assert.match(traceNote, /No package-index release/);
  assert.match(traceNote, /No downstream consumer receipt/);
  assert.doesNotMatch(traceNote, /no clean public repository/i);
  assert.doesNotMatch(traceNote, /Local release candidate/i);
});
