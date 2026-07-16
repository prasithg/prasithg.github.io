import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const distRoot = new URL('../dist/', import.meta.url);
const homepage = await readFile(new URL('index.html', distRoot), 'utf8');
const workIndex = await readFile(new URL('work/index.html', distRoot), 'utf8');
const evidenceNote = await readFile(new URL('work/attested-scheduler/index.html', distRoot), 'utf8');

const plainText = evidenceNote
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z0-9#]+;/gi, ' ');

test('site links the attested scheduler field note from the homepage and work index', () => {
  assert.match(homepage, /href="\/work\/attested-scheduler\/"/);
  assert.match(workIndex, /href="\/work\/attested-scheduler\/"/);
});

test('attested scheduler note exposes the exact hosted receipt', () => {
  for (const marker of [
    'One workflow. One signed identity.',
    '37 focused controls',
    '101 project tests',
    '20 ledger cases',
    '1 verified attestation',
    '3 hosted checks',
    '29530399682',
    '80b1831',
  ]) {
    assert.match(evidenceNote, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
});

test('attested scheduler note keeps the authority boundary explicit', () => {
  assert.match(plainText, /pull request event, not a schedule event/i);
  assert.match(plainText, /does not prove scheduler-owner absence/i);
  assert.match(plainText, /not safe for destructive recovery/i);
  assert.match(plainText, /pull request remains open/i);
  assert.match(plainText, /no independent model review is claimed/i);
  assert.doesNotMatch(plainText, /production[- ]proven|merged and deployed|safe for destructive recovery:\s*true/i);
});

test('attested scheduler note links exact public evidence with safe new-tab attributes', () => {
  for (const href of [
    'https://github.com/prasithg/claude-desktop-supervisor/pull/3',
    'https://github.com/prasithg/claude-desktop-supervisor/actions/runs/29530399682',
  ]) {
    const escaped = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.match(evidenceNote, new RegExp(`<a[^>]+href="${escaped}"[^>]+target="_blank"[^>]+rel="noopener noreferrer"`));
  }
});

test('attested scheduler note has canonical metadata and safe navigation', () => {
  assert.match(evidenceNote, /<link rel="canonical" href="https:\/\/prasithg\.github\.io\/work\/attested-scheduler\/">/);
  assert.match(evidenceNote, /<meta property="og:url" content="https:\/\/prasithg\.github\.io\/work\/attested-scheduler\/">/);
  assert.match(evidenceNote, /<a class="nav-brand" href="\/#top"/);
  assert.match(evidenceNote, /<a class="nav-contact" href="\/#contact"/);
});

test('attested scheduler public copy passes AWDS lexical guards', () => {
  assert.doesNotMatch(plainText, /—/u);
  assert.doesNotMatch(plainText, /#\w+/);
  assert.doesNotMatch(plainText, /\b(?:delve|tapestry|crucial|furthermore|moreover|revolutionary|game[- ]changing|mind[- ]blowing|next[- ]level)\b/i);
  assert.doesNotMatch(plainText, /\b(?:Absolutely|Great question|Happy to help|Hot take|Unpopular opinion)\b/i);
});
