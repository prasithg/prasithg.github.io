#!/usr/bin/env python3
"""Deploy gate: nothing marked for review may go live.

Anything in the site tagged data-review="pending" (draft notes, the unreviewed teaser,
their build-log rows) blocks the Pages deploy until Prasith approves it and the flag is
removed (for notes: drop "review": "pending" from notes/notes.json and re-render).
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def pending() -> list[str]:
    hits = []
    for path in sorted(ROOT.rglob("*.html")):
        if any(part.startswith(".") for part in path.relative_to(ROOT).parts):
            continue
        n = path.read_text().count('data-review="pending"')
        if n:
            hits.append(f"{path.relative_to(ROOT)}: {n}")
    return hits


def main() -> int:
    hits = pending()
    if hits:
        print("publish-blocked: review-pending content present")
        for h in hits:
            print(f"- {h}")
        return 1
    print("publish-ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
