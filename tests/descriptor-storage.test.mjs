import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const distRoot = new URL('../dist/', import.meta.url);
const homepage = await readFile(new URL('index.html', distRoot), 'utf8');
const workIndex = await readFile(new URL('work/index.html', distRoot), 'utf8');
const fieldNote = await readFile(new URL('work/descriptor-storage/index.html', distRoot), 'utf8');

const plainText = fieldNote
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z0-9#]+;/gi, ' ');

test('site links the descriptor-relative storage field note from the homepage and work index', () => {
  assert.match(homepage, /href="\/work\/descriptor-storage\/"/);
  assert.match(workIndex, /href="\/work\/descriptor-storage\/"/);
});

test('descriptor storage note exposes the exact bounded receipt', () => {
  for (const marker of [
    'The scratch scan became part of the control plane',
    'descriptor_relative_no_follow',
    '611,856 bytes',
    '198 regular files',
    '204 entries',
    '38 / 38 cron sessions',
    '109 / 109 project tests',
    '8 / 8 storage controls',
    '2 GiB',
    '20,000 files',
  ]) {
    assert.match(fieldNote, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
});

test('descriptor storage note keeps point-in-time accounting separate from filesystem trust', () => {
  assert.match(plainText, /point-in-time metadata inventory/i);
  assert.match(plainText, /not an authenticated filesystem snapshot/i);
  assert.match(plainText, /very deep directory nesting/i);
  assert.match(plainText, /no live Hermes source, config, or cron/i);
  assert.match(plainText, /no independent pass/i);
  assert.doesNotMatch(plainText, /tamper-proof|production[- ]proven|authenticated snapshot|safe for recovery/i);
});

test('descriptor storage note has canonical metadata and passes AWDS lexical guards', () => {
  assert.match(fieldNote, /<link rel="canonical" href="https:\/\/prasithg\.github\.io\/work\/descriptor-storage\/">/);
  assert.match(fieldNote, /<meta property="og:url" content="https:\/\/prasithg\.github\.io\/work\/descriptor-storage\/">/);
  assert.doesNotMatch(plainText, /—/u);
  assert.doesNotMatch(plainText, /#\w+/);
  assert.doesNotMatch(plainText, /\b(?:delve|tapestry|crucial|furthermore|moreover|revolutionary|game[- ]changing|mind[- ]blowing|next[- ]level)\b/i);
  assert.doesNotMatch(plainText, /\b(?:Absolutely|Great question|Happy to help|Hot take|Unpopular opinion)\b/i);
});
