import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const distRoot = new URL('../dist/', import.meta.url);
const homepage = await readFile(new URL('index.html', distRoot), 'utf8');
const workIndex = await readFile(new URL('work/index.html', distRoot), 'utf8');
const fieldNote = await readFile(new URL('work/native-windows-owner/index.html', distRoot), 'utf8');

const plainText = fieldNote
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z0-9#]+;/gi, ' ');

test('site links the native Windows owner field note from the homepage and work index', () => {
  assert.match(homepage, /href="\/work\/native-windows-owner\/"/);
  assert.match(workIndex, /href="\/work\/native-windows-owner\/"/);
});

test('native Windows owner note exposes the exact hosted receipt', () => {
  for (const marker of [
    'The same owner contract, on Windows',
    'Windows 2025',
    '29534557615',
    '8389970744',
    '2fd0f476',
    '4 / 4 native controls',
  ]) {
    assert.match(fieldNote, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
});

test('native Windows owner note records the red provenance failure and behavior boundaries', () => {
  assert.match(plainText, /converted the two snapshots to CRLF/i);
  assert.match(plainText, /three behavior cases already passed/i);
  assert.match(plainText, /stale heartbeat.*still-running process.*present/is);
  assert.match(plainText, /terminated child.*process_missing/is);
});

test('native Windows owner note keeps authority and release limits explicit', () => {
  assert.match(plainText, /safe_for_destructive_recovery.*false/i);
  assert.match(plainText, /pull request remains open/i);
  assert.match(plainText, /no schedule-event coverage/i);
  assert.match(plainText, /no independent model review/i);
  assert.doesNotMatch(plainText, /production[- ]proven|merged and deployed|safe for destructive recovery:\s*true/i);
});

test('native Windows owner note links exact public evidence with safe new-tab attributes', () => {
  for (const href of [
    'https://github.com/prasithg/claude-desktop-supervisor/pull/4',
    'https://github.com/prasithg/claude-desktop-supervisor/actions/runs/29534557615',
    'https://github.com/prasithg/claude-desktop-supervisor/commit/2fd0f4767e8f7974192da3e310c20662b7514e8c',
  ]) {
    const escaped = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.match(fieldNote, new RegExp(`<a[^>]+href="${escaped}"[^>]+target="_blank"[^>]+rel="noopener noreferrer"`));
  }
});

test('native Windows owner note has canonical metadata and passes AWDS lexical guards', () => {
  assert.match(fieldNote, /<link rel="canonical" href="https:\/\/prasithg\.github\.io\/work\/native-windows-owner\/">/);
  assert.match(fieldNote, /<meta property="og:url" content="https:\/\/prasithg\.github\.io\/work\/native-windows-owner\/">/);
  assert.doesNotMatch(plainText, /—/u);
  assert.doesNotMatch(plainText, /#\w+/);
  assert.doesNotMatch(plainText, /\b(?:delve|tapestry|crucial|furthermore|moreover|revolutionary|game[- ]changing|mind[- ]blowing|next[- ]level)\b/i);
  assert.doesNotMatch(plainText, /\b(?:Absolutely|Great question|Happy to help|Hot take|Unpopular opinion)\b/i);
});
