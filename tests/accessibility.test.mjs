import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const css = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');

function channelToLinear(channel) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const channels = hex.match(/[a-f\d]{2}/gi)?.map((channel) => Number.parseInt(channel, 16));
  assert.equal(channels?.length, 3, `invalid hex color: ${hex}`);
  const [red, green, blue] = channels.map(channelToLinear);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(foreground, background) {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

function themeTokens(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const block = css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`))?.[1];
  assert.ok(block, `missing ${selector} token block`);
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[a-f\d]{6})\s*;/gi)].map((match) => [match[1], match[2]]),
  );
}

test('small-text theme tokens retain WCAG AA contrast on their raised surfaces', () => {
  const themes = [
    { name: 'dark', tokens: themeTokens(':root'), surfaces: ['bg', 'surface', 'surface-raised'], text: ['muted', 'quiet', 'amber'] },
    { name: 'light', tokens: themeTokens(":root[data-theme='light']"), surfaces: ['bg', 'surface', 'surface-raised'], text: ['muted', 'quiet', 'amber'] },
  ];

  for (const theme of themes) {
    for (const textToken of theme.text) {
      for (const surfaceToken of theme.surfaces) {
        const ratio = contrast(theme.tokens[textToken], theme.tokens[surfaceToken]);
        assert.ok(
          ratio >= 4.5,
          `${theme.name} --${textToken} on --${surfaceToken} is ${ratio.toFixed(2)}:1; expected at least 4.5:1`,
        );
      }
    }
  }
});
