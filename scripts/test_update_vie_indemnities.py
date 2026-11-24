import json
import runpy
import unittest
from datetime import date
from io import BytesIO
from decimal import Decimal
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import Mock, patch

SCRIPTS = Path(__file__).resolve().parent
# Each entry records the city, monthly total, publication date, and expected
# dataset row. Null means no offer was published in November for that country.
FIXTURE = json.loads(
    (SCRIPTS / "fixtures/business-france-november-2026.json").read_text(encoding="utf-8")
)
UPDATE = runpy.run_path(str(SCRIPTS / "update-vie-indemnities.py"))["main"]
ROW = UPDATE.__globals__["ROW"]
ORIGINAL = SCRIPTS.parent / "data/indemnity-archive/2025.tsx"


class November2026(date):
    @classmethod
    def today(cls):
        return cls(2026, 11, 25)


class UpdateVieIndemnitiesTest(unittest.TestCase):
    def test_fetches_current_public_key_for_each_offer(self):
        responses = [
            BytesIO(br'{GMAPS_API_KEY:"unrelated",API_KEY:"first\u002Fkey"}'),
            BytesIO(b'{"result":[]}'),
            BytesIO(b'{API_KEY:"second-key"}'),
            BytesIO(b'{"result":[]}'),
        ]
        namespace = UPDATE.__globals__
        open_url = Mock(side_effect=responses)
        with patch.dict(namespace, urlopen=open_url):
            self.assertIsNone(namespace["fetch_offer"]("DE"))
            self.assertIsNone(namespace["fetch_offer"]("SG"))

        requests = [call.args[0] for call in open_url.call_args_list]
        self.assertEqual([req.full_url for req in requests[::2]], [
            namespace["SITE"] + "/pays",
            namespace["SITE"] + "/pays",
        ])
        self.assertEqual(
            [req.get_header("X-api-key") for req in requests[1::2]],
            ["first/key", "second-key"],
        )

    def test_all_countries_in_november_snapshot(self):
        requested = set()

        def fetch_offer(code):
            requested.add(code)
            entry = FIXTURE[code]
            if entry is None:
                return None
            city, amount, published, _row_id = entry
            return {
                "countryId": code,
                "cityName": city,
                "startBroadcastDate": published,
                "indemnite": Decimal(amount),
            }

        with TemporaryDirectory() as directory:
            root = Path(directory)
            data = root / "rates.tsx"
            data.write_bytes(ORIGINAL.read_bytes())
            with patch.dict(
                UPDATE.__globals__,
                DATA=data,
                ARCHIVE=root / "archive",
                date=November2026,
                fetch_offer=fetch_offer,
            ):
                UPDATE()
            updated = data.read_text(encoding="utf-8")
            actual = {int(row["id"]): row[0] for row in ROW.finditer(updated)}

        self.assertIn('export const indemnityDataMonth = "2026-11";', updated)
        self.assertEqual(requested, set(FIXTURE))
        expected = {
            entry[3]: Decimal(entry[1]) for entry in FIXTURE.values() if entry is not None
        }
        before = {
            int(row["id"]): row for row in ROW.finditer(ORIGINAL.read_text(encoding="utf-8"))
        }
        self.assertEqual(actual.keys(), before.keys())
        for row_id, row in before.items():
            with self.subTest(destination=row["name"]):
                if row_id in expected:
                    total = expected[row_id]
                    geographic = total - Decimal(row["common"])
                    self.assertEqual(
                        actual[row_id],
                        f'{row["prefix"]}    geographicIndemnity: {geographic:.2f},\n'
                        f"    monthlyPay: {total:.2f},",
                    )
                else:
                    self.assertEqual(actual[row_id], row[0])


if __name__ == "__main__":
    unittest.main()
