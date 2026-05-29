#!/usr/bin/env python3
"""
Optimize site imagery into full-resolution WebP derivatives.

This is a one-time / on-demand helper, NOT a site build step: the website
itself ships as plain static files and does not depend on this script at
runtime. Re-run it whenever you add or replace source PNGs in assets/.

    python3 tools/optimize-images.py

Requires Pillow (`pip install Pillow`). Originals are never modified; new
`<name>.webp` files are written next to each source image so the existing PNGs
remain available as <picture> fallbacks. The WebPs keep the original pixel
dimensions to avoid soft screenshots from downscaled derivatives.
"""
import os
import glob
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# (glob, webp quality). The company logo intentionally stays PNG-only.
JOBS = [
    ("assets/screenshots/*.png", 95),
    ("assets/icons/*.png", 95),
]


def optimize(src, quality):
    im = Image.open(src).convert("RGBA")
    w0, h0 = im.size
    stem, _ = os.path.splitext(src)
    dst = f"{stem}.webp"
    im.save(dst, "WEBP", quality=quality, method=6)
    return w0, h0, dst, os.path.getsize(dst)


def main():
    os.chdir(ROOT)
    total_src = total_out = 0
    for pattern, quality in JOBS:
        for src in sorted(glob.glob(pattern)):
            src_size = os.path.getsize(src)
            total_src += src_size
            w0, h0, dst, out_size = optimize(src, quality)
            total_out += out_size
            print(f"{src}  ({w0}x{h0}, {src_size/1024:.0f}KB)\n"
                  f"    -> {dst} ({out_size/1024:.0f}KB)")
    print(f"\nSource PNGs: {total_src/1e6:.1f} MB")
    print(f"WebP output: {total_out/1e6:.1f} MB")


if __name__ == "__main__":
    main()
