# Vision Music — Marketing Site

Static landing site for the Vision Music Android app. Branding and copy are
pulled from the real app source at `~/Desktop/visionmusicapp`.

## Structure

```
visionmusic-site/
├── index.html
├── privacy.html
├── assets/
│   ├── styles.css
│   └── img/
│       ├── icon-512.png         # store icon (from store_icon_512x512.png)
│       ├── feature-graphic.png  # Play feature graphic 1024×500
│       ├── logo-1024.jpg        # in-app logo (1024×1024)
│       ├── screen-home.png      # real screenshot
│       ├── screen-library.png
│       └── screen-discover.png
└── README.md
```

## Brand tokens (mirrored from `lib/vision_theme.dart`)

- Gold primary `#C39A4A`
- Gold light `#D4AA5A`
- Background `#0E0500`
- Surface `#1A0A00`
- Card `#231200`
- Text soft `#AA9880`

## Preview locally

```bash
cd ~/Desktop/visionmusic-site
python3 -m http.server 5173 --bind 127.0.0.1
# open http://127.0.0.1:5173/
```

## Publish

1. **Netlify Drop** — drag the `visionmusic-site` folder to
   https://app.netlify.com/drop. Instant public URL; no account required.
2. **GitHub Pages** — create a public repo, push, enable Pages.
3. **Vercel** — `vercel --prod`.
4. **Cloudflare Pages** — direct upload or GitHub connect.

For Google Play Console → Privacy Policy, use:
`https://<your-host>/privacy.html`

## Placeholders to replace

- `support@visionmusic.app` — switch to a real monitored inbox.
- `https://visionmusic.app` — replace with the final public URL.
- Google Play button — set `href` to the real Play Store listing once live.
