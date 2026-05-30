# Project Guidance

## Website Architecture

- This website must remain a static website that can be hosted with the free GitHub Pages feature.
- GitHub Pages reads the repository root for the website implementation, so keep the public entry files such as `index.html`, `privacy.html`, `style.css`, and `script.js` in the repo root unless the hosting setup is intentionally changed.
- Do not introduce a required build step, server runtime, database, user account backend, or paid hosting dependency for the public website.

## Image Assets

- Use `tools/optimize-images.py` to create `.webp` derivatives from PNG image assets when adding or replacing optimized website imagery.
- When converting images to `.webp`, always keep the original image's pixel resolution. Do not downscale or otherwise resize the converted image unless explicitly requested.
- Keep original PNG files as fallbacks alongside generated `.webp` files.

## Branding And Legal Name

- Use the public branding name `Orange Forge AI` for ordinary website copy.
- When `Orange Forge AI` appears by itself as the brand name in visible page content, include a superscript `TM`, for example: `Orange Forge AI<sup>TM</sup>`.
- The company theme color is `#f37100`. Whenever visually appropriate, render standalone `Orange Forge AI` branding in this color.
- Do not overuse the legal entity name in normal marketing copy. Use `Orange Forge AI, LLC` only where the legal company name is needed, such as company details, footer/copyright text, privacy policy operator language, or other legally relevant contexts.
- Do not add `TM` inside the legal entity name. Write `Orange Forge AI, LLC`, not `Orange Forge AI<sup>TM</sup>, LLC` or `Orange Forge AI TM, LLC`.
