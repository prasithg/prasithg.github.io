import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');

test('homepage exposes the agreed section contract', () => {
  for (const id of ['main', 'building', 'work', 'experiments', 'contact']) {
    assert.match(html, new RegExp(`id="${id}"`), `missing #${id}`);
  }

  const projectCards = html.match(/data-project="[^"]+"/g) ?? [];
  assert.equal(projectCards.length, 5, 'expected exactly five selected-build cards');

  for (const project of ['parker', 'hermes', 'clawrari', 'video-engine', 'jobleap-/-workconnect']) {
    assert.ok(
      projectCards.some((card) => card.includes(`"${project}"`)),
      `missing project card for ${project}`,
    );
  }
});

test('PrasClaw-reviewed copy is complete and remains addressable', () => {
  const slots = [...html.matchAll(/data-copy-slot="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(slots.length >= 35, `expected at least 35 rendered copy slots, found ${slots.length}`);
  assert.ok(slots.includes('hero.title.primary'));
  assert.ok(slots.includes('projects.parker.description'));
  assert.ok(slots.includes('operating.body.1'));
  assert.ok(slots.includes('contact.body'));

  assert.doesNotMatch(html, /data-copy-state="pending-voice-pass"/);
  assert.doesNotMatch(html, /copy (?:slot|pass|and link) pending/i);
});

test('unconfirmed contact and family-health details stay outside the release candidate', () => {
  assert.doesNotMatch(html, /mailto:/i);
  assert.doesNotMatch(html, /Parkinson(?:'s)?/i);
  assert.doesNotMatch(html, /\bfamily\b/i);
  assert.doesNotMatch(html, /for my dad/i);
});

test('public copy passes the AWDS lexical release guard', () => {
  assert.doesNotMatch(html, /—/u);
  assert.doesNotMatch(
    html,
    /\b(?:delve|tapestry|crucial|furthermore|moreover|revolutionary|game[- ]changing|mind[- ]blowing|next[- ]level)\b/i,
  );
  assert.doesNotMatch(html, /\b(?:Absolutely|Great question|Happy to help|Hot take|Unpopular opinion)\b/i);
});

test('metadata and structured data are complete enough for a copy-only follow-up', () => {
  assert.match(html, /<html[^>]+lang="en"[^>]+data-theme="dark"/);
  assert.match(html, /<title>Prasith Govin: Founder, CTO, agent builder<\/title>/);
  assert.match(html, /<meta property="og:title" content="Prasith Govin">/);
  assert.match(html, /<meta property="og:description" content="Founder and CTO building assistive AI,/);
  assert.match(html, /<link rel="canonical" href="https:\/\/prasithg\.com\/">/);
  assert.match(html, /<meta property="og:image" content="https:\/\/prasithg\.com\/prasith-govin\.jpg">/);
  assert.match(html, /<meta property="og:image:alt" content="[^"]+">/);
  assert.match(html, /<meta name="twitter:image:alt" content="[^"]+">/);
  assert.match(html, /<script type="application\/ld\+json">/);
  assert.match(html, /"@type":"Person"/);
});

test('external links have safe new-tab attributes and no empty destinations', () => {
  const newTabAnchors = html.match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? [];
  assert.ok(newTabAnchors.length >= 8, 'expected project and social external links');

  for (const anchor of newTabAnchors) {
    assert.match(anchor, /rel="noopener noreferrer"/, `unsafe external link: ${anchor}`);
  }

  assert.doesNotMatch(html, /href="(?:undefined|null|)"/);
  assert.doesNotMatch(html, /\blorem ipsum\b/i);
});
