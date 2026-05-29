#!/usr/bin/env python3
"""
Optimize site imagery into responsive WebP derivatives.

This is a one-time / on-demand helper, NOT a site build step: the website
itself ships as plain static files and does not depend on this script at
runtime. Re-run it whenever you add or replace source PNGs in assets/.

    python3 tools/optimize-images.py

Requires Pillow (`pip install Pillow`). Originals are never modified; new
`<name>-<width>.webp` files are written next to each source image so the
existing PNGs remain available as <picture> fallbacks.
"""
import os
import glob
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# (glob, [target widths], webp quality). Widths larger than the source are
# skipped so we never upscale.
JOBS = [
    # Device screenshots: landscape Mac shots vs. portrait iPad/iPhone shots
    # both fit comfortably within these candidate widths for srcset.
    ("assets/screenshots/mac_*.png",    [1600, 1000, 600], 80),
    ("assets/screenshots/ipad_*.png",   [1280, 800, 480], 80),
    ("assets/screenshots/iphone_*.png", [900, 600, 360], 80),
    # Brand mark + app icon are simple graphics shown small; keep them crisp.
    ("assets/brand/logo.png",           [256, 96], 90),
    ("assets/icons/*.png",              [512, 256], 90),
]


def optimize(src, widths, quality):
    im = Image.open(src).convert("RGBA")
    w0, h0 = im.size
    stem, _ = os.path.splitext(src)
    out = []
    for w in sorted({min(w, w0) for w in widths}, reverse=True):
        h = round(h0 * w / w0)
        resized = im.resize((w, h), Image.LANCZOS)
        dst = f"{stem}-{w}.webp"
        resized.save(dst, "WEBP", quality=quality, method=6)
        out.append((dst, w, h, os.path.getsize(dst)))
    return w0, h0, out


def main():
    os.chdir(ROOT)
    total_src = total_out = 0
    for pattern, widths, quality in JOBS:
        for src in sorted(glob.glob(pattern)):
            src_size = os.path.getsize(src)
            total_src += src_size
            w0, h0, outs = optimize(src, widths, quality)
            made = ", ".join(f"{w}w {sz/1024:.0f}KB" for _, w, _, sz in outs)
            total_out += sum(sz for *_, sz in outs)
            print(f"{src}  ({w0}x{h0}, {src_size/1024:.0f}KB)\n    -> {made}")
    print(f"\nSource PNGs: {total_src/1e6:.1f} MB")
    print(f"WebP output: {total_out/1e6:.1f} MB")


if __name__ == "__main__":
    main()
