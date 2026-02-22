#!/usr/bin/env python3
"""Download all shadcnblocks component JSONs into public/r/ for self-hosted registry.

Rate limit aware: ~300 requests per ~40 minutes per API key.
Runs sequentially with 2s delay to stay under limits.
"""

import asyncio
import aiohttp
import json
import os
import ssl
import sys
import time
from pathlib import Path

import certifi

API_KEY = os.environ.get("SHADCNBLOCKS_API_KEY", "")
BASE_URL = "https://www.shadcnblocks.com/r"
OUTPUT_DIR = Path("shadcn-registry/public/r")
COMPONENTS_FILE = Path("components.txt")
REQUEST_DELAY = 1.5  # seconds between requests to avoid rate limiting
RETRY_WAIT = 300     # seconds to wait when rate limited (5 min, then check again)
MAX_RATE_LIMIT_RETRIES = 20  # ~100 minutes max wait

async def fetch_component(session, name):
    url = f"{BASE_URL}/{name}"
    headers = {"Authorization": f"Bearer {API_KEY}"}
    out_path = OUTPUT_DIR / f"{name}.json"

    if out_path.exists():
        return name, "skipped"

    for rate_retry in range(MAX_RATE_LIMIT_RETRIES):
        try:
            async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=30)) as resp:
                if resp.status == 200:
                    data = await resp.text()
                    out_path.write_text(data)
                    return name, "ok"
                elif resp.status == 429:
                    text = await resp.text()
                    try:
                        retry_after = json.loads(text).get("retryAfter", RETRY_WAIT)
                    except Exception:
                        retry_after = RETRY_WAIT
                    print(f"  Rate limited. Waiting {retry_after}s...", flush=True)
                    await asyncio.sleep(retry_after + 10)
                    continue
                elif resp.status == 401:
                    return name, "error:401"
                else:
                    return name, f"error:{resp.status}"
        except Exception as e:
            return name, f"exception:{type(e).__name__}"

    return name, "error:rate_limit_exhausted"

async def main():
    if not API_KEY:
        print("ERROR: SHADCNBLOCKS_API_KEY not set", file=sys.stderr)
        sys.exit(1)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    names = [line.strip() for line in COMPONENTS_FILE.read_text().splitlines() if line.strip()]
    total = len(names)

    # Count already downloaded
    already = sum(1 for n in names if (OUTPUT_DIR / f"{n}.json").exists())
    print(f"Total: {total} | Already downloaded: {already} | Remaining: {total - already}", flush=True)

    ssl_ctx = ssl.create_default_context(cafile=certifi.where())
    ok = skipped = errors = 0
    start = time.time()

    async with aiohttp.ClientSession(connector=aiohttp.TCPConnector(ssl=ssl_ctx)) as session:
        for i, name in enumerate(names, 1):
            name, status = await fetch_component(session, name)
            if status == "ok":
                ok += 1
                await asyncio.sleep(REQUEST_DELAY)
            elif status == "skipped":
                skipped += 1
            else:
                errors += 1
                if "rate_limit" not in status:
                    print(f"  SKIP [{name}]: {status}", flush=True)
            if i % 50 == 0 or i == total:
                elapsed = time.time() - start
                rate = (ok + errors) / max(elapsed, 1) * 60
                print(f"  {i}/{total} — ok:{ok} skipped:{skipped} errors:{errors} ({rate:.0f} req/min)", flush=True)

    print(f"\nDone. {ok} downloaded, {skipped} skipped, {errors} errors.", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
