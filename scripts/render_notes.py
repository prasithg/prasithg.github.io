#!/usr/bin/env python3
"""Authoring helper: re-render notes/*.html, the home-page notes list, feed.xml and sitemap.xml
from notes/notes.json + each note's <article> body.

The site still deploys with no build step: run this locally, commit the output.
    python3 scripts/render_notes.py          # rewrite files
    python3 scripts/render_notes.py --check  # exit 1 if any output is stale (CI)
"""
from __future__ import annotations

import html
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
# note.css is the source of truth; it is inlined so note pages need no render-blocking request
NOTE_CSS = (ROOT / "assets" / "note.css").read_text()
SITE = "https://prasithg.com"
MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split()


def month_label(date: str) -> str:
    y, m = date.split("-")[:2]
    return f"{MONTHS[int(m) - 1]} {y}"


def iso(date: str) -> str:
    parts = date.split("-")
    if len(parts) == 2:  # month-precision legacy notes
        parts.append("01")
    return f"{parts[0]}-{parts[1]}-{parts[2]}T12:00:00Z"


def words(text: str) -> int:
    return len(re.sub(r"<[^>]+>", " ", text).split())


def article_body(slug: str) -> str:
    src = (ROOT / "notes" / f"{slug}.html").read_text()
    m = re.search(r"<article[^>]*>(.*?)</article>", src, re.S)
    if not m:
        raise SystemExit(f"notes/{slug}.html has no <article>")
    body = m.group(1).strip()
    # strip a previously rendered review banner so re-renders are idempotent
    body = re.sub(r'<aside class="review-flag[^"]*".*?</aside>\s*', "", body, flags=re.S)
    return body


NOTE_TMPL = """<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title_h} | Prasith Govin</title>
<meta name="description" content="{summary_h}">
<meta name="author" content="Prasith Govin">
<meta name="color-scheme" content="light dark">
<link rel="canonical" href="{url}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Prasith Govin">
<meta property="og:title" content="{title_h}">
<meta property="og:description" content="{summary_h}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/assets/og/{slug}.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@prasithg">
<meta name="twitter:title" content="{title_h}">
<meta name="twitter:description" content="{summary_h}">
<meta name="twitter:image" content="{SITE}/assets/og/{slug}.png">
<link rel="alternate" type="application/atom+xml" title="Prasith Govin, notes" href="/feed.xml">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/inter-v3.woff2" as="font" type="font/woff2" crossorigin>
<style>
{css}</style>
<script>try{{var t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t)}}catch(e){{}}</script>
<script type="application/ld+json">
{ld}
</script>
</head>
<body>
<a class="skip" href="#main">Skip to article</a>
<header class="bar">
  <div class="bar-in">
    <a class="brand mono" href="/"><b>Prasith Govin</b></a>
    <nav class="bar-nav mono" aria-label="Site"><a href="/#building">Building</a><a href="/#log">Log</a><a href="/notes/index.html">Notes</a></nav>
    <button class="toggle mono" id="themeToggle" type="button" aria-pressed="false">Dark<span class="vh"> theme</span></button>
  </div>
</header>
<main id="main" class="col">
  <p class="crumb mono"><a href="/#notes">&larr; All notes</a></p>
  <h1 class="n-h1">{title_h}</h1>
  <p class="n-meta mono"><time datetime="{datetime}">{month}</time><span aria-hidden="true"> / </span>{minutes} min read</p>
  <article class="prose">
{review}{body}
  </article>
  <nav class="pn mono" aria-label="More notes">{prev}{next}</nav>
</main>
<footer class="foot">
  <div class="bar-in">
    <span class="mono">Built and maintained by my agents. Reviewed by me.</span>
    <span class="mono"><a href="/feed.xml">RSS</a><span aria-hidden="true"> / </span><a href="https://github.com/prasithg/prasithg.github.io" rel="noopener">Source</a></span>
  </div>
</footer>
<script src="/assets/theme.js" defer></script>
</body>
</html>
"""

REVIEW_FLAG = (
    '<aside class="review-flag mono" data-review="pending">Draft for Prasith\'s review. '
    "Not published until this banner is removed.</aside>\n"
)


def render_note(n: dict, prev: dict | None, nxt: dict | None) -> str:
    body = article_body(n["slug"])
    url = f"{SITE}/notes/{n['slug']}.html"
    ld = json.dumps({
        "@context": "https://schema.org", "@type": "BlogPosting",
        "headline": n["title"], "description": n["summary"], "url": url,
        "datePublished": iso(n["date"])[:10], "inLanguage": "en",
        "author": {"@type": "Person", "name": "Prasith Govin", "url": SITE + "/"},
        "image": f"{SITE}/assets/og/{n['slug']}.png",
    }, indent=2)
    link = lambda x, cls, arrow_l, arrow_r: (
        f'<a class="{cls}" href="{x["slug"]}.html">{arrow_l}{html.escape(x["title"])}{arrow_r}</a>' if x else "<span></span>")
    return NOTE_TMPL.format(
        css=NOTE_CSS, SITE=SITE, slug=n["slug"], url=url, ld=ld,
        title_h=html.escape(n["title"]), summary_h=html.escape(n["summary"], quote=True),
        datetime=iso(n["date"])[:10] if len(n["date"]) > 7 else n["date"],
        month=month_label(n["date"]), minutes=max(1, round(words(body) / 230)),
        review=REVIEW_FLAG if n.get("review") == "pending" else "", body=body,
        prev=link(prev, "pn-prev", "&larr; ", ""), next=link(nxt, "pn-next", "", " &rarr;"),
    )


def home_list(notes: list[dict]) -> str:
    out = []
    for n in notes:
        pending = ' data-review="pending"' if n.get("review") == "pending" else ""
        out.append(
            f'          <li data-slug="{n["slug"]}"{pending}><a href="notes/{n["slug"]}.html">\n'
            f'            <span class="when mono">{month_label(n["date"])}</span>\n'
            f'            <span class="n-title">{html.escape(n["title"])}</span>\n'
            f'            <span class="arw mono" aria-hidden="true">&#8599;</span>\n'
            f'            <span class="n-sum">{html.escape(n["summary"])}</span>\n'
            f"          </a></li>")
    return "\n".join(out)


def notes_index(notes: list[dict]) -> str:
    css = NOTE_CSS
    items = "\n".join(
        f'    <li><a href="{n["slug"]}.html"><span class="when mono">{month_label(n["date"])}</span>'
        f'<span class="t">{html.escape(n["title"])}</span><span class="s">{html.escape(n["summary"])}</span></a></li>'
        for n in notes)
    return f"""<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Notes | Prasith Govin</title>
<meta name="description" content="Field notes on running AI agents in production: claim, receipts, lesson.">
<meta name="color-scheme" content="light dark">
<link rel="canonical" href="{SITE}/notes/index.html">
<meta property="og:type" content="website">
<meta property="og:title" content="Notes | Prasith Govin">
<meta property="og:description" content="Field notes on running AI agents in production: claim, receipts, lesson.">
<meta property="og:url" content="{SITE}/notes/index.html">
<meta property="og:image" content="{SITE}/assets/og/home.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="alternate" type="application/atom+xml" title="Prasith Govin, notes" href="/feed.xml">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/inter-v3.woff2" as="font" type="font/woff2" crossorigin>
<style>
{css}</style>
<script>try{{var t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t)}}catch(e){{}}</script>
</head>
<body>
<a class="skip" href="#main">Skip to notes</a>
<header class="bar">
  <div class="bar-in">
    <a class="brand mono" href="/"><b>Prasith Govin</b></a>
    <nav class="bar-nav mono" aria-label="Site"><a href="/#building">Building</a><a href="/#log">Log</a><a href="/notes/index.html" aria-current="page">Notes</a></nav>
    <button class="toggle mono" id="themeToggle" type="button" aria-pressed="false">Dark<span class="vh"> theme</span></button>
  </div>
</header>
<main id="main" class="col">
  <p class="crumb mono"><a href="/">&larr; Home</a></p>
  <h1 class="n-h1">Notes</h1>
  <p class="n-meta mono">{len(notes)} entries<span aria-hidden="true"> / </span><a href="/feed.xml">RSS</a></p>
  <ol class="nlist">
{items}
  </ol>
</main>
<footer class="foot">
  <div class="bar-in">
    <span class="mono">Built and maintained by my agents. Reviewed by me.</span>
    <span class="mono"><a href="/feed.xml">RSS</a><span aria-hidden="true"> / </span><a href="https://github.com/prasithg/prasithg.github.io" rel="noopener">Source</a></span>
  </div>
</footer>
<script src="/assets/theme.js" defer></script>
</body>
</html>
"""


def feed(notes: list[dict]) -> str:
    def absolutize(body: str) -> str:
        return re.sub(r'href="(?!https?:|mailto:|#)([^"]+)"', lambda m: f'href="{SITE}/notes/{m.group(1)}"', body)
    entries = []
    for n in notes:
        url = f"{SITE}/notes/{n['slug']}.html"
        entries.append(f"""  <entry>
    <title>{html.escape(n['title'])}</title>
    <link href="{url}"/>
    <id>{url}</id>
    <updated>{iso(n['date'])}</updated>
    <summary>{html.escape(n['summary'])}</summary>
    <content type="html">{html.escape(absolutize(article_body(n['slug'])))}</content>
  </entry>""")
    updated = max(iso(n["date"]) for n in notes)
    return f"""<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Prasith Govin, notes</title>
  <subtitle>Field notes on running AI agents in production.</subtitle>
  <link href="{SITE}/feed.xml" rel="self"/>
  <link href="{SITE}/"/>
  <id>{SITE}/</id>
  <updated>{updated}</updated>
  <author><name>Prasith Govin</name><uri>{SITE}/</uri></author>
{chr(10).join(entries)}
</feed>
"""


def sitemap(notes: list[dict]) -> str:
    urls = [f"{SITE}/", f"{SITE}/notes/index.html"] + [f"{SITE}/notes/{n['slug']}.html" for n in notes]
    body = "\n".join(f"  <url><loc>{u}</loc></url>" for u in urls)
    return f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{body}\n</urlset>\n'


def outputs() -> dict[Path, str]:
    notes = json.loads((ROOT / "notes" / "notes.json").read_text())
    files: dict[Path, str] = {}
    for i, n in enumerate(notes):
        prev = notes[i - 1] if i > 0 else None       # newer
        nxt = notes[i + 1] if i + 1 < len(notes) else None  # older
        files[ROOT / "notes" / f"{n['slug']}.html"] = render_note(n, prev, nxt)
    files[ROOT / "notes" / "index.html"] = notes_index(notes)
    files[ROOT / "feed.xml"] = feed(notes)
    files[ROOT / "sitemap.xml"] = sitemap(notes)
    home = (ROOT / "index.html").read_text()
    home, n_sub = re.subn(r"<!-- notes:start -->.*?<!-- notes:end -->",
                          lambda m: "<!-- notes:start -->\n" + home_list(notes) + "\n          <!-- notes:end -->",
                          home, flags=re.S)
    if n_sub != 1:
        raise SystemExit("index.html needs exactly one <!-- notes:start --> ... <!-- notes:end --> block")
    home = re.sub(r'(<span class="count mono" id="notes-count">)\d+ entries', rf"\g<1>{len(notes)} entries", home)
    files[ROOT / "index.html"] = home
    return files


def main() -> int:
    check = "--check" in sys.argv
    stale = []
    for path, text in outputs().items():
        if not path.exists() or path.read_text() != text:
            stale.append(path.relative_to(ROOT))
            if not check:
                path.write_text(text)
    if check and stale:
        print("render-stale: run python3 scripts/render_notes.py")
        for p in stale:
            print(f"- {p}")
        return 1
    print("render-ok" if check else f"rendered {len(outputs())} files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
