#!/usr/bin/env python3
"""
Download 80px-wide PNG flags for the exact 193-country NTC list used by the demo.

Steps:
1) Open the demo in a browser and run:
   window.KB_DEBUG.exportNtCountries()
   This downloads kb_ntc_countries_193.json

2) Run:
   python3 download_flags_w80.py kb_ntc_countries_193.json

Outputs:
- flags_80/<cca2>.png
- flags_80_manifest.json
"""

from __future__ import annotations

import json
import os
import sys
import time
import urllib.request
from urllib.error import HTTPError, URLError

FLAG_URL_TMPL = "https://flagcdn.com/w80/{code}.png"  # 80px wide

def die(msg: str, code: int = 1) -> None:
    print(msg, file=sys.stderr)
    raise SystemExit(code)

def load_list(path: str) -> list[dict]:
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    countries = data.get("countries")
    if not isinstance(countries, list):
        die("Input JSON missing 'countries' list.")
    out = []
    for c in countries:
        if not isinstance(c, dict):
            continue
        cca2 = str(c.get("cca2", "")).strip().lower()
        name = str(c.get("name", "")).strip()
        if not cca2 or len(cca2) != 2:
            continue
        out.append({"cca2": cca2, "name": name})
    if not out:
        die("No valid cca2 entries found in input JSON.")
    return out

def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "k-bucks-flag-downloader/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read()

def main() -> None:
    if len(sys.argv) != 2:
        die("Usage: python3 download_flags_w80.py kb_ntc_countries_193.json")

    in_path = sys.argv[1]
    countries = load_list(in_path)

    out_dir = "flags_w80"
    os.makedirs(out_dir, exist_ok=True)

    manifest = []
    ok = 0
    failed = 0

    for i, c in enumerate(countries, 1):
        code = c["cca2"]
        url = FLAG_URL_TMPL.format(code=code)
        out_path = os.path.join(out_dir, f"{code}.png")

        if os.path.exists(out_path) and os.path.getsize(out_path) > 0:
            manifest.append({"cca2": code, "name": c["name"], "file": out_path, "url": url})
            ok += 1
            continue

        try:
            data = fetch(url)
            with open(out_path, "wb") as f:
                f.write(data)
            manifest.append({"cca2": code, "name": c["name"], "file": out_path, "url": url})
            ok += 1
            print(f"[{i}/{len(countries)}] OK {code}  {c['name']}")
        except (HTTPError, URLError, TimeoutError) as e:
            failed += 1
            print(f"[{i}/{len(countries)}] FAIL {code}  {c['name']}  ({e})", file=sys.stderr)
        time.sleep(0.05)  # be nice to the CDN

    manifest_path = os.path.join(out_dir, "flags_80_manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump({"count_ok": ok, "count_failed": failed, "flags": manifest}, f, indent=2)

    print("")
    print(f"Done. Downloaded {ok} flags, {failed} failed.")
    print(f"Manifest: {manifest_path}")
    if failed:
        die("Some downloads failed. Re-run to retry missing files.", 2)

if __name__ == "__main__":
    main()
