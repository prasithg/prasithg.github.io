import importlib.util
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location(
    "site_contract", ROOT / "scripts" / "check_site_contract.py"
)
assert SPEC is not None and SPEC.loader is not None
site_contract = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(site_contract)


class SiteContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.approved = (ROOT / "index.html").read_text()

    def test_approved_site_passes(self):
        self.assertEqual(site_contract.check_html(self.approved), [])

    def test_routine_project_copy_change_remains_allowed(self):
        changed = self.approved.replace("Parker", "Parker updated", 1)
        self.assertEqual(site_contract.check_html(changed), [])

    def test_hero_change_fails(self):
        changed = self.approved.replace(
            site_contract.APPROVED_TEXT["thesis"], "A longer replacement headline."
        )
        issues = site_contract.check_html(changed)
        self.assertTrue(any("approved thesis changed" in issue for issue in issues))

    def test_style_change_fails(self):
        changed = self.approved.replace("--bg:      #FBFAF8", "--bg:      #FFFFFF")
        issues = site_contract.check_html(changed)
        self.assertTrue(any("overall style changed" in issue for issue in issues))


if __name__ == "__main__":
    unittest.main()
