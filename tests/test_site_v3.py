"""v3 site integrity: rendered notes are fresh, every internal reference resolves, feed + sitemap
are valid, fonts are self-hosted, media stays within budget, and basic page semantics hold."""
import importlib.util
import json
import re
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("render_notes", ROOT / "scripts" / "render_notes.py")
render_notes = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(render_notes)

PAGES = sorted(p for p in ROOT.rglob("*.html") if not any(x.startswith(".") for x in p.relative_to(ROOT).parts))
NOTES = json.loads((ROOT / "notes" / "notes.json").read_text())


def refs(page: Path):
    text = page.read_text()
    for m in re.finditer(r'(?:href|src|srcset|poster)="([^"]+)"', text):
        yield m.group(1)


class SiteV3Tests(unittest.TestCase):
    def test_rendered_outputs_are_fresh(self):
        stale = [str(p.relative_to(ROOT)) for p, t in render_notes.outputs().items() if p.read_text() != t]
        self.assertEqual(stale, [], "run python3 scripts/render_notes.py")

    def test_every_manifest_note_has_page_and_og_card(self):
        for n in NOTES:
            self.assertTrue((ROOT / "notes" / f"{n['slug']}.html").exists(), n["slug"])
            self.assertTrue((ROOT / "assets" / "og" / f"{n['slug']}.png").exists(), n["slug"])
        self.assertTrue((ROOT / "assets" / "og" / "home.png").exists())

    def test_no_orphan_note_pages(self):
        slugs = {n["slug"] for n in NOTES} | {"index"}
        pages = {p.stem for p in (ROOT / "notes").glob("*.html")}
        self.assertEqual(pages - slugs, set())

    def test_internal_references_resolve(self):
        missing = []
        for page in PAGES:
            for ref in refs(page):
                url = ref.split()[0]
                parsed = urlparse(url)
                if parsed.scheme or url.startswith(("#", "mailto:", "//")):
                    if parsed.netloc == "prasithg.com":
                        url = parsed.path or "/"
                    else:
                        continue
                path = url.split("#")[0].split("?")[0]
                if not path:
                    continue
                target = (ROOT / path.lstrip("/")) if path.startswith("/") else (page.parent / path)
                if target.is_dir() or path.endswith("/"):
                    target = target / "index.html"
                if not target.resolve().exists():
                    missing.append(f"{page.relative_to(ROOT)} -> {ref}")
        self.assertEqual(missing, [])

    def test_feed_and_sitemap_are_valid_xml(self):
        feed = ET.parse(ROOT / "feed.xml").getroot()
        ns = {"a": "http://www.w3.org/2005/Atom"}
        self.assertEqual(len(feed.findall("a:entry", ns)), len(NOTES))
        urls = ET.parse(ROOT / "sitemap.xml").getroot()
        self.assertEqual(len(urls), len(NOTES) + 2)

    def test_fonts_are_self_hosted(self):
        for page in PAGES:
            self.assertNotIn("fonts.googleapis.com", page.read_text(), page.name)

    def test_media_budget(self):
        self.assertLess((ROOT / "assets/video/parker-teaser.mp4").stat().st_size, 15 * 1024 * 1024)
        for f in (ROOT / "assets/og").glob("*.png"):
            self.assertLess(f.stat().st_size, 250 * 1024, f.name)

    def test_page_semantics(self):
        for page in PAGES:
            text = page.read_text()
            self.assertRegex(text, r'<html lang="en"', page.name)
            self.assertEqual(len(re.findall(r"<h1[\s>]", text)), 1, page.name)
            self.assertIn("<title>", text, page.name)
            for img in re.findall(r"<img\b[^>]*>", text):
                self.assertIn(" alt=", img, page.name)

    def test_note_pages_carry_share_metadata(self):
        for n in NOTES:
            text = (ROOT / "notes" / f"{n['slug']}.html").read_text()
            for needle in ('rel="canonical"', 'property="og:image"', 'application/ld+json', 'name="description"'):
                self.assertIn(needle, text, f"{n['slug']} missing {needle}")

    def test_pending_review_is_visible_and_gated(self):
        spec = importlib.util.spec_from_file_location("check_publishable", ROOT / "scripts" / "check_publishable.py")
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        pending_notes = [n for n in NOTES if n.get("review") == "pending"]
        for n in pending_notes:
            text = (ROOT / "notes" / f"{n['slug']}.html").read_text()
            self.assertIn('class="review-flag', text)
        if pending_notes:
            self.assertTrue(mod.pending(), "pending notes must block the deploy gate")


if __name__ == "__main__":
    unittest.main()
