"""Refresh the local V.I.E. rates using the latest Business France offer per country."""

import json
import re
import sys
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from decimal import Decimal
from hashlib import sha256
from pathlib import Path
from unicodedata import normalize
from urllib.parse import urlencode
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "src/data/countries_v.i.e_data.tsx"
ARCHIVE = ROOT / "data/indemnity-archive"
METADATA = ROOT / "src/data/countryMetadata.ts"
SITE = "https://mon-vie-via.businessfrance.fr"
PUBLIC_API_KEY = re.compile(r'(?:[,{])\s*API_KEY\s*:\s*("(?:[^"\\]|\\.)*")')
ROW = re.compile(
    r'(?P<prefix>    countryId: (?P<id>\d+),\n    name: "(?P<name>[^"]+)",\n'
    r'    commonIndemnity: (?P<common>[\d.]+),\n)'
    r'    geographicIndemnity: [\d.]+,\n    monthlyPay: (?P<total>[\d.]+),'
)
DATA_MONTH = re.compile(r'^export const indemnityDataMonth = "\d{4}-\d{2}";\n\n')

# Exact offer locations that belong to a regional or "other cities" row.
REGIONAL_ROWS = {
    ("AE", "DUBAI"): 11,
    ("AU", "MELBOURNE"): 50,
    ("CA", "MONTREAL -QC"): 150,
    ("CH", "BALE"): 838,
    ("CM", "YAOUNDE"): 145,
    ("DE", "FRANKFURT AM MAIN"): 25,
    ("GA", "PORT GENTIL"): 311,
    ("MA", "CASABLANCA"): 585,
    ("PL", "VARSOVIE"): 715,
    ("TR", "ISTANBUL"): 907,
    ("US", "WAUWATOSA -WI-"): 276,
}


def normalize_city(city):
    return " ".join(
        normalize("NFKD", city).encode("ascii", "ignore").decode().upper().split()
    )


def choose_row(code, rows, offer):
    city = normalize_city(offer.get("cityName") or "")
    if not city:
        return None
    if len(rows) == 1:
        return rows[0]

    regional_id = REGIONAL_ROWS.get((code, city))
    matches = []
    for row in rows:
        location = row["name"].partition(" (")[2].removesuffix(")")
        cities = [normalize_city(name) for name in location.split(",")]
        explicit_city = city in cities and not any(
            word in location.lower() for word in ("autres", "hors")
        )
        if regional_id == int(row["id"]) or explicit_city:
            matches.append(row)
    return matches[0] if len(matches) == 1 else None


def fetch_public_api_key():
    request = Request(f"{SITE}/pays", headers={"Cache-Control": "no-cache"})
    with urlopen(request, timeout=20) as response:
        page = response.read().decode("utf-8")
    match = PUBLIC_API_KEY.search(page)
    if not match:
        raise ValueError("Public Business France API key not found")
    key = json.loads(match[1])
    if not key:
        raise ValueError("Public Business France API key is empty")
    return key


def fetch_offer(code):
    try:
        key = fetch_public_api_key()
    except (OSError, ValueError) as error:
        raise RuntimeError(f"Could not load the public API key for {code}") from error

    request = Request(
        f"https://api-mon-vie-via.businessfrance.fr/api/Offers/country/{code}",
        data=b'{"skip":0,"limit":1}',
        headers={
            "X-API-KEY": key,
            "Origin": SITE,
            "Referer": SITE + "/",
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    )
    try:
        with urlopen(request, timeout=20) as response:
            offers = json.load(response, parse_float=Decimal)["result"]
        if not isinstance(offers, list) or len(offers) > 1:
            raise ValueError("unexpected offer response")
        return offers[0] if offers else None
    except (OSError, ValueError, KeyError) as error:
        raise RuntimeError(f"Business France offer request failed for {code}") from error


def update_illustrated_destinations():
    query = urlencode({
        "predicate": '[at(document.type, "country")]',
        "options": json.dumps({
            "pageSize": 100,
            "fetch": ["my.country.name", "my.country.image"],
            "lang": "fr-fr",
        }),
    })
    request = Request(
        f"https://api-mon-vie-via.businessfrance.fr/api/Prismic/Query?{query}",
        headers={"X-API-KEY": fetch_public_api_key(), "Origin": SITE, "Referer": SITE + "/"},
    )
    with urlopen(request, timeout=20) as response:
        document = json.load(response)
    results = document["results"]
    if not results or len(results) != document["total_results_size"]:
        raise ValueError("Business France returned an empty or incomplete destination list")
    names = sorted({
        entry["data"]["name"]
        for entry in results
        if (entry["data"].get("image") or {}).get("url")
    })
    if not names or not all(isinstance(name, str) and name.strip() for name in names):
        raise ValueError("Business France returned invalid illustrated destinations")
    (ROOT / "src/data/illustratedDestinations.json").write_text(
        json.dumps(names, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Refreshed {len(names)} illustrated destinations.")


def main():
    metadata = METADATA.read_text().split("const flagCodeByCountry = {", 1)[1].split("}", 1)[0]
    codes = {
        quoted or bare: code.upper()
        for quoted, bare, code in re.findall(
            r'^\s*(?:"([^"]+)"|([A-Z_]+)):\s*"([a-z]{2})",', metadata, re.M
        )
    }
    original = DATA.read_bytes()
    source = original.decode("utf-8")
    rows = list(ROW.finditer(source))
    if not rows or len(rows) != source.count("monthlyPay:"):
        raise SystemExit("Unexpected indemnity dataset format.")

    country_rows = defaultdict(list)
    for row in rows:
        code = codes.get(row["name"].split(" (", 1)[0])
        if code:
            country_rows[code].append(row)

    # Rates are revised quarterly. Use offers published during the current quarter.
    today = date.today()
    quarter_start = date(today.year, ((today.month - 1) // 3) * 3 + 1, 1)
    updates = {}
    verified = 0
    with ThreadPoolExecutor(max_workers=6) as pool:
        offers = pool.map(fetch_offer, country_rows)
        for code, offer in zip(country_rows, offers, strict=True):
            if not offer or offer.get("countryId") != code:
                continue
            published = date.fromisoformat(offer["startBroadcastDate"][:10])
            if not quarter_start <= published <= today:
                continue
            row = choose_row(code, country_rows[code], offer)
            if row is None:
                continue
            amount = offer.get("indemnite")
            if not isinstance(amount, (int, Decimal)) or isinstance(amount, bool):
                continue
            total = Decimal(amount)
            common = Decimal(row["common"])
            if not total.is_finite() or total <= common or total != round(total, 2):
                continue
            verified += 1
            if total != Decimal(row["total"]):
                updates[row.start()] = (
                    f'{row["prefix"]}    geographicIndemnity: {total - common:.2f},\n'
                    f"    monthlyPay: {total:.2f},"
                )

    if not verified:
        raise SystemExit("No rates could be verified for the current quarter.")
    if updates:
        ARCHIVE.mkdir(parents=True, exist_ok=True)
        snapshot = ARCHIVE / f"{sha256(original).hexdigest()}.tsx"
        if not snapshot.exists():
            snapshot.write_bytes(original)
        updated = ROW.sub(lambda row: updates.get(row.start(), row[0]), source)
        month = today.strftime("%Y-%m")
        DATA.write_text(
            f'export const indemnityDataMonth = "{month}";\n\n'
            + DATA_MONTH.sub("", updated, count=1),
            encoding="utf-8",
        )
    print(f"Verified {verified} of {len(rows)} rates. Updated {len(updates)}.")


if __name__ == "__main__":
    if sys.argv[1:] == ["--illustrated-destinations"]:
        update_illustrated_destinations()
    else:
        main()
