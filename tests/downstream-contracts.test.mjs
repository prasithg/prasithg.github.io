import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const distRoot = new URL('../dist/', import.meta.url);
const homepage = await readFile(new URL('index.html', distRoot), 'utf8');
const evidenceNote = await readFile(new URL('work/downstream-contracts/index.html', distRoot), 'utf8');

test('homepage links the downstream-contracts build-log row', () => {
  assert.match(homepage, /href="\/work\/downstream-contracts\/"/);
  assert.match(homepage, />Read the consumer note</);
});

test('downstream-contracts note identifies both producer and consumer revisions', () => {
  for (const marker of [
    'Two contracts, one downstream system',
    '52bbea3cfde10f60e78c7c74e82dee00e7dcc6ba',
    '837659dab007930a4f92dec166722614c0abfe8f',
    '68fc07ef7eace20f5f9de06483dcfe999e424f9c',
    '2e4f18d7274dce7d999f88313d0ed824296ee491',
    '5 / 5',
    '4 / 4',
  ]) {
    assert.match(evidenceNote, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('downstream-contracts note makes open-PR and same-owner boundaries prominent', () => {
  assert.match(evidenceNote, /Both pull requests remain open/);
  assert.match(evidenceNote, /same-owner integration evidence/i);
  assert.match(evidenceNote, /outside adoption remains unproven/i);
  assert.doesNotMatch(evidenceNote, /\b(?:adopted|production-proven|externally validated)\b/i);
  assert.doesNotMatch(evidenceNote, /both (?:contracts|pull requests) (?:are|were) merged/i);
});

test('downstream-contracts note names the fail-closed behavior', () => {
  for (const marker of [
    'Public export denied',
    'Gap without replay',
    'Unknown event',
    'Provenance mismatch',
    'Metadata-only receipts',
  ]) {
    assert.match(evidenceNote, new RegExp(marker, 'i'));
  }
});

test('downstream-contracts note links exact public evidence safely', () => {
  for (const href of [
    'https://github.com/prasithg/agent-knowledge-boundary-contracts',
    'https://github.com/prasithg/lossless-terminal-recovery-contract',
    'https://github.com/prasithg/claude-desktop-supervisor/pull/1',
    'https://github.com/prasithg/claude-desktop-supervisor/pull/2',
  ]) {
    const escaped = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.match(
      evidenceNote,
      new RegExp(`<a[^>]+href="${escaped}"[^>]+target="_blank"[^>]+rel="noopener noreferrer"`),
    );
  }
});

test('downstream-contracts public copy passes route metadata and AWDS lexical guards', () => {
  assert.match(evidenceNote, /<link rel="canonical" href="https:\/\/prasithg\.github\.io\/work\/downstream-contracts\/">/);
  assert.match(evidenceNote, /<meta property="og:url" content="https:\/\/prasithg\.github\.io\/work\/downstream-contracts\/">/);

  const publicText = evidenceNote
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ');
  assert.doesNotMatch(publicText, /—/u);
  assert.doesNotMatch(publicText, /#\w+/);
  assert.doesNotMatch(publicText, /\b(?:delve|tapestry|crucial|furthermore|moreover|revolutionary|game[- ]changing|mind[- ]blowing|next[- ]level)\b/i);
  assert.doesNotMatch(publicText, /\b(?:Absolutely|Great question|Happy to help|Hot take|Unpopular opinion)\b/i);
});
