import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const distRoot = new URL('../dist/', import.meta.url);
const routes = [
  'trace-to-tripwire',
  'parker-confirmation-repair',
  'parker-wrapper-boundary',
  'harness-delta',
  'cdp-download-policy',
  'descriptor-storage',
  'release-pipeline',
  'downstream-contracts',
  'attested-scheduler',
  'native-windows-owner',
];

const homepage = await readFile(new URL('index.html', distRoot), 'utf8');
const workIndex = await readFile(new URL('work/index.html', distRoot), 'utf8');

function primaryNavigation(html) {
  const navigation = html.match(/<nav class="site-nav"[\s\S]*?<\/nav>/)?.[0];
  assert.ok(navigation, 'missing primary navigation');
  return navigation;
}

test('the evidence lab is a first-class destination in the persistent navigation', () => {
  for (const [name, html] of [['homepage', homepage], ['work index', workIndex]]) {
    const navigation = primaryNavigation(html);
    assert.match(navigation, /href="\/work\/"/i, `${name} does not link to the evidence lab`);
    assert.match(navigation, />\s*Evidence lab\s*</i, `${name} does not name the evidence lab`);
  }

  assert.match(primaryNavigation(workIndex), /href="\/work\/"[^>]*aria-current="page"/i);
  assert.doesNotMatch(primaryNavigation(homepage), /href="\/work\/"[^>]*aria-current="page"/i);
});

test('every field note returns directly to the evidence lab', async () => {
  for (const route of routes) {
    const html = await readFile(new URL(`work/${route}/index.html`, distRoot), 'utf8');
    const navigation = primaryNavigation(html);
    assert.match(navigation, /href="\/work\/"[^>]*aria-current="location"/i, `${route} lacks the persistent evidence-lab location`);
    assert.match(html, /href="\/work\/"[^>]*>\s*Browse all evidence notes/i, `${route} lacks the direct evidence-lab return`);
  }
});

test('the evidence-lab control remains visible and touch-sized when section links collapse', async () => {
  const css = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');
  assert.match(css, /\.nav-lab\s*\{[\s\S]*?min-height:\s*44px/i);
  assert.doesNotMatch(css, /\.nav-lab\s*\{[^}]*display:\s*none/i);
  assert.match(css, /@media \(max-width: 380px\)[\s\S]*?\.nav-contact\s*\{[^}]*display:\s*none/i);
});
