import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const distRoot = new URL('../dist/', import.meta.url);
const homepage = await readFile(new URL('index.html', distRoot), 'utf8');
const evidenceNote = await readFile(new URL('work/release-pipeline/index.html', distRoot), 'utf8');

test('homepage links the site build-log row to the release-pipeline note', () => {
  assert.match(homepage, /href="\/work\/release-pipeline\/"/);
  assert.match(homepage, />Read the release note</);
});

test('release-pipeline note explains the complete gated path', () => {
  assert.match(evidenceNote, /<h1[^>]*>\s*Shipping this site\s*<\/h1>/);
  for (const marker of [
    'Local gate',
    'Hosted quality',
    'Pages deployment',
    'Live surface',
    '22 / 22',
    '4 routes',
    '3 / 3',
    'Desktop + mobile',
  ]) {
    assert.match(evidenceNote, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('release-pipeline note preserves deployment and custom-domain boundaries', () => {
  assert.match(evidenceNote, /Deployment target: prasithg\.github\.io/);
  assert.match(evidenceNote, /Custom domain: not configured/);
  assert.match(evidenceNote, /The Pages configuration reports no custom domain/);
  assert.match(evidenceNote, /strict TLS fails/);
  assert.doesNotMatch(evidenceNote, /deployed (?:at|to) prasithg\.com/i);
  assert.doesNotMatch(evidenceNote, /custom domain (?:is )?(?:live|fixed|verified)/i);
  assert.doesNotMatch(evidenceNote, /GitHub Pages \/ verified|CURRENT RECEIPTS|The GitHub Pages release is verified|verified (?:host|surface)|live release receipt|URL that passed/i);
  assert.doesNotMatch(homepage, /prasithg\.com rebuild|deployed through|public \/ green/i);
});

test('release-pipeline note links to public source with safe new-tab attributes', () => {
  for (const href of [
    'https://github.com/prasithg/prasithg.github.io',
    'https://github.com/prasithg/prasithg.github.io/blob/main/.github/workflows/deploy.yml',
  ]) {
    const escaped = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.match(
      evidenceNote,
      new RegExp(`<a[^>]+href="${escaped}"[^>]+target="_blank"[^>]+rel="noopener noreferrer"`),
    );
  }
});

test('release-pipeline note has route metadata, safe navigation, and an AWDS lexical guard', () => {
  assert.match(evidenceNote, /<link rel="canonical" href="https:\/\/prasithg\.github\.io\/work\/release-pipeline\/">/);
  assert.match(evidenceNote, /<meta property="og:url" content="https:\/\/prasithg\.github\.io\/work\/release-pipeline\/">/);
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
  assert.doesNotMatch(publicText, /\b(?:Absolutely|Great question|Happy to help|Hot take|Unpopular opinion)\b/i);
});
