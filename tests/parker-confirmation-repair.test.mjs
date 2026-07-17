import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const distRoot = new URL('../dist/', import.meta.url);
const homepage = await readFile(new URL('index.html', distRoot), 'utf8');
const workIndex = await readFile(new URL('work/index.html', distRoot), 'utf8');
const fieldNote = await readFile(new URL('work/parker-confirmation-repair/index.html', distRoot), 'utf8');

const plainText = fieldNote
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z0-9#]+;/gi, ' ');

test('site links the Parker confirmation-repair field note from the homepage and work index', () => {
  assert.match(homepage, /href="\/work\/parker-confirmation-repair\/"/);
  assert.match(workIndex, /href="\/work\/parker-confirmation-repair\/"/);
});

test('Parker note exposes the exact synthetic repair receipt', () => {
  for (const marker of [
    'A rejection during confirmation must cancel the target',
    'None... none of these.',
    '9 / 9 synthetic scenarios',
    '69 targeted tests',
    '635 / 635 full tests',
    '9e446053',
    'PR 19',
    'patient_confirmation_rejected',
    '0 external actions',
  ]) {
    assert.match(fieldNote, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
});

test('Parker note keeps deterministic synthetic evidence separate from product or clinical proof', () => {
  assert.match(plainText, /synthetic text scenario/i);
  assert.match(plainText, /open and unmerged/i);
  assert.match(plainText, /independent review.*pending/i);
  assert.match(plainText, /no real call or message/i);
  assert.match(plainText, /not patient, caregiver-usability, clinical, or production evidence/i);
  assert.doesNotMatch(plainText, /clinically validated|patient[- ]proven|caregiver usability (?:passed|proven)|production[- ]ready|Parker (?:works|succeeds) in the real world/i);
});

test('Parker note links exact public evidence safely', () => {
  for (const href of [
    'https://github.com/prasithg/parker/pull/19',
    'https://github.com/prasithg/parker/blob/9e4460538f94be883c786229a8b992d74b802aa1/benchmark/reports/parker_demo_interactivity_eval_latest.json',
    'https://github.com/prasithg/parker/actions/runs/29549778861',
  ]) {
    const escaped = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.match(fieldNote, new RegExp(`<a[^>]+href="${escaped}"[^>]+target="_blank"[^>]+rel="noopener noreferrer"`));
  }
});

test('Parker note has canonical metadata and passes AWDS lexical guards', () => {
  assert.match(fieldNote, /<link rel="canonical" href="https:\/\/prasithg\.github\.io\/work\/parker-confirmation-repair\/">/);
  assert.match(fieldNote, /<meta property="og:url" content="https:\/\/prasithg\.github\.io\/work\/parker-confirmation-repair\/">/);
  assert.doesNotMatch(plainText, /—/u);
  assert.doesNotMatch(plainText, /#\w+/);
  assert.doesNotMatch(plainText, /\b(?:delve|tapestry|crucial|furthermore|moreover|revolutionary|game[- ]changing|mind[- ]blowing|next[- ]level)\b/i);
  assert.doesNotMatch(plainText, /\b(?:Absolutely|Great question|Happy to help|Hot take|Unpopular opinion)\b/i);
});
