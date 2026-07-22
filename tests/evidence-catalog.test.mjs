import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const distRoot = new URL('../dist/', import.meta.url);
const homepage = await readFile(new URL('index.html', distRoot), 'utf8');
const workIndex = await readFile(new URL('work/index.html', distRoot), 'utf8');

const plainText = (html) => html
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z0-9#]+;/gi, ' ')
  .replace(/\s+/g, ' ');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const catalogModule = new URL('../src/data/evidence.ts', import.meta.url);

test('one typed evidence catalog drives the homepage build log and work index', async () => {
  const { evidenceCatalog } = await import(catalogModule);
  const routes = evidenceCatalog.map((note) => note.href);

  assert.equal(evidenceCatalog.length, 10, 'expected ten unique evidence notes');
  assert.equal(new Set(routes).size, routes.length, 'evidence-note routes must be unique');

  for (const note of evidenceCatalog) {
    assert.match(homepage, new RegExp(`href="${escapeRegExp(note.href)}"`), `${note.href} missing from homepage`);
    assert.match(workIndex, new RegExp(`href="${escapeRegExp(note.href)}"`), `${note.href} missing from work index`);

    const indexText = plainText(workIndex);
    for (const value of [note.title, note.status, note.receipt[0], note.limit]) {
      assert.match(indexText, new RegExp(escapeRegExp(value), 'i'), `${note.href} missing catalog value: ${value}`);
    }

    for (const row of note.homepageRows) {
      const homepageText = plainText(homepage);
      for (const value of [row.name.value, row.status.value]) {
        assert.match(homepageText, new RegExp(escapeRegExp(value), 'i'), `${note.href} missing homepage catalog value: ${value}`);
      }
    }
  }
});

test('catalog count and route truth are rendered without hard-coded work-index drift', async () => {
  const [{ evidenceCatalog }, indexSource, siteSource, buildLogSource] = await Promise.all([
    import(catalogModule),
    readFile(new URL('../src/pages/work/index.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/data/site.ts', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/BuildLog.astro', import.meta.url), 'utf8'),
  ]);

  assert.match(workIndex, new RegExp(`${evidenceCatalog.length} field notes`, 'i'));
  assert.doesNotMatch(indexSource, /const\s+notes\s*=\s*\[/, 'work index keeps a second evidence inventory');
  assert.match(indexSource, /evidenceCatalog\.map\(/, 'work index does not render the canonical catalog');
  assert.doesNotMatch(siteSource, /\/work\/[a-z0-9-]+\//, 'site data keeps duplicate evidence routes');
  assert.match(buildLogSource, /evidenceCatalog\.flatMap\(/, 'build log does not render the canonical catalog');
});
