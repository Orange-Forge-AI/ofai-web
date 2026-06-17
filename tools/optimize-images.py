#!/usr/bin/env python3
"""
Optimize source PNG screenshots into full-resolution WebP assets.

This is a one-time / on-demand helper, NOT a site build step: the website
itself ships as plain static files and does not depend on this script at
runtime. Re-run it whenever you add or replace source PNGs in assets/pngs/.

    python3 tools/optimize-images.py

Requires Pillow (`pip install Pillow`). Source files are read from
assets/pngs/<app>/ and converted WebPs are written to the matching
assets/screenshots/<app>/ folder. The WebPs keep the original pixel dimensions
to avoid soft screenshots from downscaled derivatives. Source PNGs are deleted
after each successful conversion.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE_ROOT = ROOT / "assets" / "pngs"
DEST_ROOT = ROOT / "assets" / "screenshots"
QUALITY = 95


def optimize(src):
    relative = src.relative_to(SOURCE_ROOT)
    dst = DEST_ROOT / relative.with_suffix(".webp")
    dst.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(src) as source:
        im = source.convert("RGBA")
        w0, h0 = im.size
        im.save(dst, "WEBP", quality=QUALITY, method=6)

    src.unlink()
    return w0, h0, dst, dst.stat().st_size


def main():
    total_src = total_out = 0
    sources = sorted(SOURCE_ROOT.rglob("*.png"))

    if not sources:
        print(f"No PNG files found in {SOURCE_ROOT.relative_to(ROOT)}.")
        return

    for src in sources:
        src_size = src.stat().st_size
        total_src += src_size
        w0, h0, dst, out_size = optimize(src)
        total_out += out_size
        print(f"{src.relative_to(ROOT)}  ({w0}x{h0}, {src_size/1024:.0f}KB)\n"
              f"    -> {dst.relative_to(ROOT)} ({out_size/1024:.0f}KB)")

    print(f"\nSource PNGs: {total_src/1e6:.1f} MB")
    print(f"WebP output: {total_out/1e6:.1f} MB")


if __name__ == "__main__":
    main()
