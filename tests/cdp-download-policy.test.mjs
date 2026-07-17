import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const distRoot = new URL('../dist/', import.meta.url);
const homepage = await readFile(new URL('index.html', distRoot), 'utf8');
const workIndex = await readFile(new URL('work/index.html', distRoot), 'utf8');
const fieldNote = await readFile(new URL('work/cdp-download-policy/index.html', distRoot), 'utf8');

const plainText = fieldNote
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z0-9#]+;/gi, ' ');

test('site links the CDP download-policy field note from the homepage and work index', () => {
  assert.match(homepage, /href="\/work\/cdp-download-policy\/"/);
  assert.match(workIndex, /href="\/work\/cdp-download-policy\/"/);
});

test('CDP download-policy note exposes the exact local live receipt', () => {
  for (const marker of [
    'Browser policy can drift without disconnecting',
    'Chrome for Testing 151',
    '10 / 10 tests',
    'DRIFT_QUARANTINED',
    'DENY_OBSERVED',
    'POLICY_DRIFT',
    'DENY_RESTORED',
    '1 quarantined canary',
    'f3e53f7a',
  ]) {
    assert.match(fieldNote, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
});

test('CDP download-policy note keeps detection separate from prevention', () => {
  assert.match(plainText, /canary.*after a synthetic effect/is);
  assert.match(plainText, /does not identify the mutating client/i);
  assert.match(plainText, /no direct policy getter/i);
  assert.match(plainText, /disposable browser/i);
  assert.match(plainText, /local experiment/i);
  assert.doesNotMatch(plainText, /prevents policy drift|safe for real profiles|production[- ]proven|extension parity proven/i);
});

test('CDP download-policy note links authoritative public protocol sources safely', () => {
  for (const href of [
    'https://chromedevtools.github.io/devtools-protocol/tot/Browser#method-setDownloadBehavior',
    'https://developer.chrome.com/blog/remote-debugging-port',
  ]) {
    const escaped = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.match(fieldNote, new RegExp(`<a[^>]+href="${escaped}"[^>]+target="_blank"[^>]+rel="noopener noreferrer"`));
  }
});

test('CDP download-policy note has canonical metadata and passes AWDS lexical guards', () => {
  assert.match(fieldNote, /<link rel="canonical" href="https:\/\/prasithg\.github\.io\/work\/cdp-download-policy\/">/);
  assert.match(fieldNote, /<meta property="og:url" content="https:\/\/prasithg\.github\.io\/work\/cdp-download-policy\/">/);
  assert.doesNotMatch(plainText, /—/u);
  assert.doesNotMatch(plainText, /#\w+/);
  assert.doesNotMatch(plainText, /\b(?:delve|tapestry|crucial|furthermore|moreover|revolutionary|game[- ]changing|mind[- ]blowing|next[- ]level)\b/i);
  assert.doesNotMatch(plainText, /\b(?:Absolutely|Great question|Happy to help|Hot take|Unpopular opinion)\b/i);
});
