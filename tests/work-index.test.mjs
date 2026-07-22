import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const distRoot = new URL('../dist/', import.meta.url);
const homepage = await readFile(new URL('index.html', distRoot), 'utf8');
const workIndex = await readFile(new URL('work/index.html', distRoot), 'utf8');

const plainText = workIndex
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z0-9#]+;/gi, ' ');

test('homepage links to a dedicated artifact-first work index', () => {
  assert.match(homepage, /href="\/work\/"/);
  assert.match(homepage, />\s*Browse all evidence notes/);
});

test('work index exposes every verified evidence note', () => {
  for (const route of [
    '/work/trace-to-tripwire/',
    '/work/parker-confirmation-repair/',
    '/work/parker-wrapper-boundary/',
    '/work/harness-delta/',
    '/work/cdp-download-policy/',
    '/work/descriptor-storage/',
    '/work/release-pipeline/',
    '/work/downstream-contracts/',
    '/work/attested-scheduler/',
    '/work/native-windows-owner/',
  ]) {
    assert.match(workIndex, new RegExp(`href="${route}"`));
  }
});

test('work index keeps status, receipts, limits, and source surfaces together', () => {
  for (const marker of [
    '10 field notes',
    '84 site tests',
    'Metadata only / CI green',
    'Consolidated draft / synthetic eval green',
    '9 / 9 synthetic scenarios',
    '708 / 708 consolidated tests',
    'not patient, caregiver-usability, clinical, or production evidence',
    'Consolidated draft / inactive harness green',
    '9 / 9 inactive checks',
    'PR 27 is a CI-green draft',
    '0 live activations',
    'No separate OS identities',
    'Abstained / cleanup fails closed',
    'Local experiment / live browser',
    'Local operations / verified',
    'Deployed / verified',
    'Open PRs / CI green',
    'Open PR / attested run',
    'Open PR / native CI green',
    'No live exporter receipt',
    'No model comparison ran',
    '23 / 23 harness tests',
    'Cleanup unconfirmed becomes exit 126',
    '1 quarantined synthetic canary',
    '611,856-byte live inventory',
    'Point-in-time metadata only',
    'Custom domain remains excluded',
    'Outside adoption remains unproven',
    'No schedule-event coverage',
    '4 / 4 native controls',
    'Public source',
    'Hosted run',
    'Live route',
    'Consumer pull requests',
    'Windows hosted run',
  ]) {
    assert.match(workIndex, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
});

test('work index metadata resolves to the verified GitHub Pages surface', () => {
  assert.match(workIndex, /<link rel="canonical" href="https:\/\/prasithg\.github\.io\/work\/">/);
  assert.match(workIndex, /<meta property="og:url" content="https:\/\/prasithg\.github\.io\/work\/">/);
});

test('work index does not inflate blocked claims', () => {
  assert.match(plainText, /no winner, ranking, or score/i);
  assert.doesNotMatch(plainText, /\b(?:adopted|production-proven|clinically validated)\b/i);
  assert.doesNotMatch(plainText, /\b(?:best model|model ranking|declared a winner|found a winner)\b/i);
  assert.doesNotMatch(plainText, /prasithg\.com is (?:live|deployed)/i);
});

test('work index public copy passes AWDS lexical guards', () => {
  assert.doesNotMatch(plainText, /—/u);
  assert.doesNotMatch(plainText, /#\w+/);
  assert.doesNotMatch(plainText, /\b(?:delve|tapestry|crucial|furthermore|moreover|revolutionary|game[- ]changing|mind[- ]blowing|next[- ]level)\b/i);
  assert.doesNotMatch(plainText, /\b(?:Absolutely|Great question|Happy to help|Hot take|Unpopular opinion)\b/i);
});
