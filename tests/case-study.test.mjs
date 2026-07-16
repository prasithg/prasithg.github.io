import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const distRoot = new URL('../dist/', import.meta.url);
const homepage = await readFile(new URL('index.html', distRoot), 'utf8');
const caseStudy = await readFile(new URL('work/trace-to-tripwire/index.html', distRoot), 'utf8');

test('homepage links to the Trace-to-Tripwire evidence note', () => {
  assert.match(homepage, /href="\/work\/trace-to-tripwire\/"/);
  assert.match(homepage, />Read the evidence note</);
});

test('evidence note publishes the bounded result and its negative claims', () => {
  assert.match(caseStudy, /<h1[^>]*>\s*Trace-to-Tripwire\s*<\/h1>/);
  assert.match(caseStudy, />21 \/ 21</);
  assert.match(caseStudy, />12 \/ 12</);
  assert.match(caseStudy, />96 files</);
  assert.match(caseStudy, />218,373 bytes</);
  assert.match(caseStudy, /Local release candidate/);
  assert.match(caseStudy, /Adoption remains untested/);
  assert.match(caseStudy, /Only public, sanitized fixtures were used/);
  assert.match(caseStudy, /Publication remains gated/);
});

test('evidence note excludes prohibited success and deployment claims', () => {
  const prohibited = /\b(?:adopted by|production-ready|proven safe|proven in production|Harness winner|Harness won|Parker clinical success|deployed at prasithg\.com)\b/i;
  assert.doesNotMatch(caseStudy, prohibited);
  assert.doesNotMatch(caseStudy, /https:\/\/prasithg\.com\/work\/trace-to-tripwire\//i);
});

test('evidence note links only to public source contracts with safe new-tab attributes', () => {
  for (const href of [
    'https://github.com/NousResearch/hermes-agent/blob/main/website/docs/developer-guide/trajectory-format.md',
    'https://github.com/openai/codex/blob/main/codex-rs/exec/src/exec_events.rs',
  ]) {
    const escaped = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.match(
      caseStudy,
      new RegExp(`<a[^>]+href="${escaped}"[^>]+target="_blank"[^>]+rel="noopener noreferrer"`),
    );
  }
});

test('evidence note has route-specific metadata and working homepage navigation', () => {
  assert.match(caseStudy, /<link rel="canonical" href="https:\/\/prasithg\.github\.io\/work\/trace-to-tripwire\/">/);
  assert.match(caseStudy, /<meta property="og:url" content="https:\/\/prasithg\.github\.io\/work\/trace-to-tripwire\/">/);
  assert.match(caseStudy, /<a class="nav-brand" href="\/#top"/);
  assert.match(caseStudy, /<a href="\/#work"/);
  assert.match(caseStudy, /<a class="nav-contact" href="\/#contact"/);
});

test('evidence note passes the public-copy lexical guard', () => {
  const publicText = caseStudy
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ');

  assert.doesNotMatch(publicText, /—/u);
  assert.doesNotMatch(publicText, /#\w+/);
  assert.doesNotMatch(
    publicText,
    /\b(?:delve|tapestry|crucial|furthermore|moreover|revolutionary|game[- ]changing|mind[- ]blowing|next[- ]level)\b/i,
  );
  assert.doesNotMatch(publicText, /\b(?:Absolutely|Great question|Happy to help|Hot take|Unpopular opinion)\b/i);
});
