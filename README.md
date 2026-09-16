# Vision Music — Marketing Site

Static landing site for the Vision Music Android and iOS app. Production
hosting is **GitHub Pages** on custom domain `visionmusic.et` (see `CNAME`).
`netlify.toml` is present for optional Netlify deploys; it is **not** what
serves production today.

## Structure

```
visionmusic-site/
├── index.html                 # marketing home + web player
├── privacy.html               # Play / App Store privacy policy URL
├── delete-account.html        # Play account-deletion + Apple privacy-choices URL
├── kayo-game/index.html       # unlinked extra page (not part of the app listing)
├── CNAME                      # visionmusic.et
├── .nojekyll
├── netlify.toml               # Netlify-only redirects (unused on GitHub Pages)
├── data/songs.json
├── js/player.js
├── assets/
│   ├── styles.css
│   ├── audio/                 # web-player MP3s
│   ├── covers/                # artist / track artwork
│   └── img/
│       ├── icon-512.png       # 512×512 store / favicon (RGB PNG)
│       ├── feature-graphic.png# currently 1024×1024 logo — not Play 1024×500
│       ├── logo-1024.jpg      # 1024×1024 JPEG (App Store icon should be PNG)
│       └── screen-home.png    # one phone screenshot 1320×2582
└── REPORT.md                  # overnight audit (2026-09-16)
```

## Brand tokens (mirrored from `lib/vision_theme.dart`)

- Gold primary `#C39A4A`
- Gold light `#D4AA5A`
- Background `#0E0500`
- Surface `#1A0A00`
- Card `#231200`
- Text soft `#AA9880`

## Store disclosure URLs

Use these in Play Console and App Store Connect (public HTML, not a PDF):

| Field | URL |
| --- | --- |
| Privacy Policy | `https://visionmusic.et/privacy.html` |
| Privacy (pretty URL) | `https://visionmusic.et/privacy` |
| Account deletion / privacy choices | `https://visionmusic.et/delete-account.html` |

**TLS caveat (2026-09-16):** HTTPS on `visionmusic.et` currently presents a
`*.github.io` certificate, so browsers reject `https://`. The same paths
respond **200 over HTTP**. GitHub Pages has `https_enforced: false`. Do not
paste a broken HTTPS URL into a store console until GitHub Pages has issued
a custom-domain certificate (GitHub repo Settings → Pages; this is not a
DNS/Cloudflare change). Until then, `http://visionmusic.et/privacy.html` is
the URL that actually loads.

## Store listing assets in this repo

| Asset | Present | Dimensions | Play / App Store fit |
| --- | --- | --- | --- |
| Hi-res icon | `assets/img/icon-512.png` | 512×512 RGB PNG | Play hi-res icon size OK |
| Feature graphic | `assets/img/feature-graphic.png` | **1024×1024** | **Not** Play's required **1024×500** |
| Phone screenshot | `assets/img/screen-home.png` | 1320×2582 | One shot only; Play needs **≥2** |
| Extra screenshots | `screen-discover.png`, `screen-library.png` | — | **Removed** in commit `bb96f9d` |
| App Store 1024 icon | `assets/img/logo-1024.jpg` | 1024×1024 JPEG | App Store Connect wants PNG |

This repo is not the Play Console upload folder. Missing/wrong-size files
still need to be exported from the app and uploaded in the consoles.

## Preview locally

```bash
python3 -m http.server 5173 --bind 127.0.0.1
# open http://127.0.0.1:5173/
```

## Production URLs

- Website: `https://visionmusic.et` (TLS currently invalid; HTTP works)
- Privacy: `https://visionmusic.et/privacy.html`
- Account deletion: `https://visionmusic.et/delete-account.html`
- Closed testing CTA: `https://play.google.com/apps/testing/com.visionmusic.app`
- Support: `visionentertainment2020@gmail.com`

## Publish

Production is GitHub Pages from branch `main` (path `/`). Optional alternatives:

1. **GitHub Pages** — this repo, custom domain `visionmusic.et`.
2. **Netlify** — `netlify.toml` publish `.` plus `/privacy` and `/delete-account` redirects.
3. **Vercel** — `vercel --prod`.
4. **Cloudflare Pages** — not configured here; do not change DNS from this repo.
