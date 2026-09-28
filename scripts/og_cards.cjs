// Authoring helper: renders 1200x630 Open Graph cards into assets/og/ (home + one per note).
// Needs Playwright:  NODE_PATH=<dir with playwright> node scripts/og_cards.cjs
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const notes = JSON.parse(fs.readFileSync(path.join(ROOT, 'notes/notes.json'), 'utf8'));
const MONTHS = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
const month = d => { const [y, m] = d.split('-'); return `${MONTHS[+m - 1]} ${y}`; };
const font = f => 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts', f)).toString('base64');
const jobs = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(ROOT, 'assets/prasith-jobs.jpg')).toString('base64');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const base = `
@font-face{font-family:Inter;font-weight:400 600;src:url(${font('inter-v3.woff2')})}
@font-face{font-family:JBM;font-weight:400 500;src:url(${font('jbm-v3.woff2')})}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#FBFAF8;color:#17181B;font-family:Inter;font-feature-settings:"cv05" 1,"ss01" 1;-webkit-font-smoothing:antialiased;overflow:hidden}
.card{position:absolute;inset:0;padding:72px 80px;display:flex;flex-direction:column}
.mono{font-family:JBM;font-size:22px;letter-spacing:.06em;text-transform:uppercase;color:#55585F}
.foot{margin-top:auto;display:flex;justify-content:space-between;border-top:2px solid #E6E3DD;padding-top:28px}
.foot b{color:#17181B;font-weight:500}`;

const home = `<style>${base}
.grid{display:grid;grid-template-columns:1fr 380px;gap:56px;align-items:start;margin-top:34px}
h1{font-weight:500;font-size:74px;line-height:1.04;letter-spacing:-.03em}
.frame{border:2px solid #D9D5CD;background:#F4F2ED;padding:8px;border-radius:4px}
.frame img{width:100%;display:block;border-radius:2px}</style>
<div class="card"><p class="mono">Founder, CTO, agent builder</p>
<div class="grid"><h1>I build small teams of AI agents that ship real software.</h1><div class="frame"><img src="${jobs}"></div></div>
<div class="foot"><span class="mono"><b>Prasith Govin</b></span><span class="mono">prasithg.com</span></div></div>`;

const note = n => `<style>${base}
h1{margin-top:40px;font-weight:500;font-size:${n.title.length > 60 ? 60 : 70}px;line-height:1.07;letter-spacing:-.028em;max-width:980px;text-wrap:balance}
p.sum{margin-top:28px;font-size:28px;line-height:1.45;color:#55585F;max-width:960px}</style>
<div class="card"><p class="mono">Field note / ${month(n.date)}</p><h1>${esc(n.title)}</h1><p class="sum">${esc(n.summary)}</p>
<div class="foot"><span class="mono"><b>Prasith Govin</b></span><span class="mono">prasithg.com/notes</span></div></div>`;

(async () => {
  const out = path.join(ROOT, 'assets/og');
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  const jobsList = [['home', home], ...notes.map(n => [n.slug, note(n)])];
  for (const [slug, html] of jobsList) {
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(out, `${slug}.png`) });
  }
  await browser.close();
  console.log(`og cards: ${jobsList.length}`);
})();
