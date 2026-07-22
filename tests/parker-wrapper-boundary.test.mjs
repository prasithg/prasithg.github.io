import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const distRoot = new URL('../dist/', import.meta.url);
const homepage = await readFile(new URL('index.html', distRoot), 'utf8');
const workIndex = await readFile(new URL('work/index.html', distRoot), 'utf8');
const fieldNote = await readFile(new URL('work/parker-wrapper-boundary/index.html', distRoot), 'utf8');

const plainText = fieldNote
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z0-9#]+;/gi, ' ');

test('site links the inactive Parker wrapper field note from the homepage and work index', () => {
  assert.match(homepage, /href="\/work\/parker-wrapper-boundary\/"/);
  assert.match(workIndex, /href="\/work\/parker-wrapper-boundary\/"/);
});

test('Parker wrapper note exposes the exact inactive harness receipt', () => {
  for (const marker of [
    'The wrapper passed only after I tested the process boundary',
    '9 / 9 inactive checks',
    '41 targeted tests',
    '708 / 708 full tests',
    '0 live activations',
    '06774961',
    'PR 27',
    'run 29888322674',
    '16 KiB',
    'one-second deadline',
  ]) {
    assert.match(fieldNote, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
});

test('Parker wrapper note keeps synthetic ownership evidence separate from deployment', () => {
  for (const marker of [
    'same-account',
    'non-root',
    'scrubbed environment',
    'no extra descriptors',
    'descriptor-relative',
    'no-follow',
    'detached descendant',
    'draft and unmerged',
    'no actual scheduled event',
    'no real call or message',
  ]) {
    assert.match(plainText, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
  assert.doesNotMatch(plainText, /production[- ]ready|deployed wrapper|trusted scheduled event|Parker (?:works|succeeds) in the real world|patient[- ]proven|clinically validated/i);
});

test('Parker wrapper note links exact public evidence safely', () => {
  for (const href of [
    'https://github.com/prasithg/parker/pull/27',
    'https://github.com/prasithg/parker/blob/0677496124ba7f9b5585bd322865959d71133bc0/benchmark/scheduled_wrapper_harness_v0.py',
    'https://github.com/prasithg/parker/blob/0677496124ba7f9b5585bd322865959d71133bc0/backend/tests/test_scheduled_wrapper_integration_harness.py',
    'https://github.com/prasithg/parker/actions/runs/29888322674',
  ]) {
    const escaped = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.match(fieldNote, new RegExp(`<a[^>]+href="${escaped}"[^>]+target="_blank"[^>]+rel="noopener noreferrer"`));
  }
});

test('Parker wrapper note has canonical metadata and passes AWDS lexical guards', () => {
  assert.match(fieldNote, /<link rel="canonical" href="https:\/\/prasithg\.github\.io\/work\/parker-wrapper-boundary\/">/);
  assert.match(fieldNote, /<meta property="og:url" content="https:\/\/prasithg\.github\.io\/work\/parker-wrapper-boundary\/">/);
  assert.doesNotMatch(plainText, /—/u);
  assert.doesNotMatch(plainText, /#\w+/);
  assert.doesNotMatch(plainText, /\b(?:delve|tapestry|crucial|furthermore|moreover|revolutionary|game[- ]changing|mind[- ]blowing|next[- ]level)\b/i);
  assert.doesNotMatch(plainText, /\b(?:Absolutely|Great question|Happy to help|Hot take|Unpopular opinion)\b/i);
});
