#!/usr/bin/env python3
"""Protect the approved site shell from routine brand updates."""

from __future__ import annotations

import hashlib
import html
import re
import sys
from pathlib import Path


APPROVED_STYLE_SHA256 = "d3f855b437cda9549f6a203a76fb22498b4ae0b2db8741412b07fd002a84d276"
APPROVED_TEXT = {
    "kicker": "Founder, CTO, agent builder",
    "thesis": "I build small teams of AI agents that ship real software.",
    "lede": (
        "CTO and founder. Years running enterprise engineering, now building lean "
        "teams where a few people plus a fleet of agents do the work of a much larger org."
    ),
}
APPROVED_NAV = ["Building", "How", "Log", "Notes"]
APPROVED_PORTRAIT = "assets/prasith-jobs.jpg"


def _normalized_fragment(source: str, pattern: str) -> str | None:
    match = re.search(pattern, source, re.DOTALL | re.IGNORECASE)
    if not match:
        return None
    without_tags = re.sub(r"<[^>]+>", " ", match.group(1))
    return " ".join(html.unescape(without_tags).split())


def check_html(source: str) -> list[str]:
    issues: list[str] = []
    style_match = re.search(r"<style>(.*?)</style>", source, re.DOTALL | re.IGNORECASE)
    if not style_match:
        issues.append("missing inline style block")
    else:
        actual_hash = hashlib.sha256(style_match.group(1).encode()).hexdigest()
        if actual_hash != APPROVED_STYLE_SHA256:
            issues.append(
                "overall style changed: "
                f"expected sha256 {APPROVED_STYLE_SHA256}, got {actual_hash}"
            )

    fields = {
        "kicker": r'<p\s+class="kicker mono"[^>]*>(.*?)</p>',
        "thesis": r'<h1\s+class="thesis"[^>]*>(.*?)</h1>',
        "lede": r'<p\s+class="lede"[^>]*>(.*?)</p>',
    }
    for name, pattern in fields.items():
        actual = _normalized_fragment(source, pattern)
        if actual != APPROVED_TEXT[name]:
            issues.append(
                f"approved {name} changed: expected {APPROVED_TEXT[name]!r}, got {actual!r}"
            )

    nav_match = re.search(r'<nav\s+class="topnav mono"[^>]*>(.*?)</nav>', source, re.DOTALL | re.IGNORECASE)
    nav_text = []
    if nav_match:
        nav_text = [
            " ".join(html.unescape(item).split())
            for item in re.findall(r"<a[^>]*>(.*?)</a>", nav_match.group(1), re.DOTALL | re.IGNORECASE)
        ]
    if nav_text != APPROVED_NAV:
        issues.append(f"approved navigation changed: expected {APPROVED_NAV!r}, got {nav_text!r}")

    portrait_match = re.search(r'<figure\s+class="portrait".*?<img\s+[^>]*src="([^"]+)"', source, re.DOTALL | re.IGNORECASE)
    portrait = portrait_match.group(1) if portrait_match else None
    if portrait != APPROVED_PORTRAIT:
        issues.append(
            f"approved portrait changed: expected {APPROVED_PORTRAIT!r}, got {portrait!r}"
        )

    return issues


def main() -> int:
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1] / "index.html"
    issues = check_html(path.read_text())
    if issues:
        print("site-contract-failed")
        for issue in issues:
            print(f"- {issue}")
        print("Routine automation may update project statements, the receipt-only build log, and notes/articles—not the approved header, hero, portrait, or CSS.")
        return 1
    print("site-contract-ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
