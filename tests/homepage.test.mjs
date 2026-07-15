import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');

test('homepage exposes the agreed section contract', () => {
  for (const id of ['main', 'builds', 'operating-model', 'experiments', 'contact']) {
    assert.match(html, new RegExp(`id="${id}"`), `missing #${id}`);
  }

  const projectCards = html.match(/data-project="[^"]+"/g) ?? [];
  assert.equal(projectCards.length, 5, 'expected exactly five selected-build cards');

  for (const project of ['parker', 'hermes-mobile', 'clawrari', 'video-engine', 'jobleap-/-workconnect']) {
    assert.ok(
      projectCards.some((card) => card.includes(`"${project}"`)),
      `missing project card for ${project}`,
    );
  }
});

test('copy remains addressable for the PrasClaw voice pass', () => {
  const slots = [...html.matchAll(/data-copy-slot="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(slots.length >= 35, `expected at least 35 rendered copy slots, found ${slots.length}`);
  assert.ok(slots.includes('hero.title.primary'));
  assert.ok(slots.includes('projects.parker.description'));
  assert.ok(slots.includes('operating.body'));
  assert.ok(slots.includes('contact.body'));

  const pendingSlots = html.match(/data-copy-state="pending-voice-pass"/g) ?? [];
  assert.equal(pendingSlots.length, 3, 'pending project descriptions should remain visibly marked');
});

test('metadata and structured data are complete enough for a copy-only follow-up', () => {
  assert.match(html, /<html[^>]+lang="en"[^>]+data-theme="dark"/);
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
