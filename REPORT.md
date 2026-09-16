# Vision Music marketing site — overnight audit

**Date:** 2026-09-16  
**Repo:** [Birra3324/visionmusic-site](https://github.com/Birra3324/visionmusic-site)  
**Production:** `visionmusic.et` (GitHub Pages, `CNAME` = `visionmusic.et`)  
**Scope:** Map structure, verify privacy URL fitness for Play / App Store, note store graphic gaps. Safe content/docs fixes only. No DNS/Cloudflare changes, no secrets, no publishes.

## Overall status: PARTIALLY VERIFIED

| Goal | Status |
| --- | --- |
| 1. Map structure (privacy, store assets, links) | **VERIFIED** |
| 2. Privacy page exists and is suitable as a store disclosure URL | **PARTIALLY VERIFIED** |
| 3. Store screenshots / feature graphic | **PARTIALLY VERIFIED** (files exist; sizes/count fail Play rules) |
| Live HTTPS privacy URL for store consoles | **BLOCKED** (certificate mismatch; not fixed here) |

---

## 1. Structure map — VERIFIED

Static site. Pages and roles:

| Path | Role | Linked from marketing nav/footer? |
| --- | --- | --- |
| `/` (`index.html`) | Landing, web player, artists, download CTA | Yes |
| `/privacy.html` and `/privacy` | Privacy policy | Yes (header + footer) |
| `/delete-account.html` and `/delete-account` | Account deletion instructions | Footer on home; added to privacy footer in this PR |
| `/kayo-game/` | Kids canvas game | **No** (public URL still live) |

**Hosting evidence**

- GitHub Pages API (`gh api repos/Birra3324/visionmusic-site/pages`, 2026-09-16): `status=built`, `cname=visionmusic.et`, `source.branch=main`, `https_enforced=false`, `html_url=http://visionmusic.et/`.
- Live `Server: GitHub.com` on both HTTP and HTTPS (HTTPS fails cert check).
- `www.visionmusic.et` → 301 → apex (`http://visionmusic.et/` or `https://visionmusic.et/`).
- `https://birra3324.github.io/visionmusic-site/` → 301 → `http://visionmusic.et/`.
- Apex A records resolve to GitHub Pages (`185.199.108–111.153`); `www` CNAME `birra3324.github.io`. Observed read-only; **not changed**.

`netlify.toml` defines `/privacy` and `/delete-account` 301s plus www→apex. Those redirects do **not** apply on GitHub Pages. Pretty URLs still work because Pages serves `privacy.html` for `/privacy` (HTTP 200, same 8559-byte body as `privacy.html` before this PR).

**Outbound links from `index.html`**

| Link | Check (2026-09-16) |
| --- | --- |
| `https://play.google.com/apps/testing/com.visionmusic.app` | 302 → Google Account sign-in (expected for closed testing; package URL is live) |
| `https://www.youtube.com/@visionentertainment4507` | HTTP 200 |
| `https://www.instagram.com/visionentertainment2020/` | HTTP 200 (login interstitial) |
| `mailto:visionentertainment2020@gmail.com` | Present on home, privacy, delete-account |
| Videos section ▶ controls | Decorative only — no YouTube/embed `href` |

No App Store / TestFlight CTA. Copy still says “testing on Android and iOS”.

**Unreferenced leftovers**

- `assets/img/artists/ali-birra.jpg` and `naaima-abdurahman.jpg` (not used by HTML).
- `assets/covers/default.png` is a byte-identical copy of `icon-512.png` (MD5 `695c583e…`) — used as Hirphaa Gaanfuree artwork.

---

## 2. Privacy page for Play / App Store URLs — PARTIALLY VERIFIED

### Page exists — VERIFIED

| URL | HTTP | HTTPS (curl default verify) | HTTPS (`curl -k`) |
| --- | --- | --- | --- |
| `http://visionmusic.et/privacy.html` | **200**, `text/html`, 8559 bytes (pre-PR) | — | — |
| `http://visionmusic.et/privacy` | **200**, same body | — | — |
| `https://visionmusic.et/privacy.html` | — | **FAIL** `SSL: no alternative certificate subject name matches target host name 'visionmusic.et'` | **200**, title `Privacy Policy — Vision Music` |
| `http://visionmusic.et/delete-account.html` | **200** | same TLS failure on HTTPS | **200**, title `Delete your account — Vision Music` |

TLS evidence (`openssl s_client -servername visionmusic.et`): leaf cert `CN=*.github.io`, SAN `*.github.io` / `github.com` / etc., **not** `visionmusic.et`. Issuer Let's Encrypt YR1, notBefore 2026-08-02, notAfter 2026-10-31.

**BLOCKED for store use of the HTTPS URL:** Play requires an active, public, non-PDF, non-editable policy URL. Browsers that follow HTTPS will show a certificate error. This PR does not enable GitHub Pages HTTPS (infrastructure, and user forbade DNS/Cloudflare work). Workaround until a custom-domain cert exists: use `http://visionmusic.et/privacy.html` or wait for Pages “Enforce HTTPS”.

### Content suitability — PARTIALLY VERIFIED

Checked against [Play User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311) and [App Store Review Guideline 5.1.1(i)](https://developer.apple.com/app-store/review/guidelines/).

| Requirement | Pre-PR page | After this PR |
| --- | --- | --- |
| Public HTML URL (not PDF) | Yes | Yes |
| What data is collected | Yes (account, activity, diagnostics, identifiers, approximate region) | Unchanged |
| How used | Yes | Unchanged |
| Sharing / processors | Firebase named | Same + Apple-style “equal protection” sentence |
| Retention & deletion | Yes; links `delete-account.html`; 30-day SLA | Unchanged |
| Contact | `visionentertainment2020@gmail.com` | Unchanged |
| Children | 18+; not directed under 13 | Unchanged |
| Android permissions | Internet, FGS, notifications, wake lock | Unchanged |
| Covers iOS (site claims iOS testing) | **No** — Android / Play only | **Yes** — iOS named; equivalent iOS capabilities; same “no contacts/camera/…” |
| How to withdraw consent | Email only | Email, sign-out, delete-account link |
| Account deletion URL (Play + Apple) | `delete-account.html` exists | Same; iOS mentioned on that page |

**Still not claimed / not verified (app source is outside this repo)**

- Exact Data safety / App Privacy nutrition-label answers.
- Whether iOS actually uses the same Firebase surfaces.
- In-app privacy link and in-app account deletion (Apple requires deletion **in the app**, not web-only). The web page is the disclosure URL, not a substitute for the in-app flow.

**Recommended console fields (once TLS works)**

- Play Console → App content → Privacy policy: `https://visionmusic.et/privacy.html`
- Play account deletion URL (if asked): `https://visionmusic.et/delete-account.html`
- App Store Connect → Privacy Policy URL: same privacy URL
- App Store Connect → User Privacy Choices URL (optional): `https://visionmusic.et/delete-account.html`

---

## 3. Store screenshots / feature graphic — PARTIALLY VERIFIED

Measured from file headers on 2026-09-16. Live `curl -k` returned the same byte sizes as git.

| File | Bytes | Pixels | Format | Store rule | Result |
| --- | --- | --- | --- | --- | --- |
| `assets/img/icon-512.png` | 235729 | 512×512 | RGB PNG | Play hi-res icon 512×512 | **Size OK** |
| `assets/img/feature-graphic.png` | 686556 | **1024×1024** | RGB PNG (no alpha) | Play feature graphic **exactly 1024×500** | **Wrong size** — this is the gold logo, not a banner |
| `assets/img/logo-1024.jpg` | 54616 | 1024×1024 | JPEG | App Store icon 1024×1024 **PNG** | **Wrong format** |
| `assets/img/screen-home.png` | 1332217 | 1320×2582 | RGB PNG | Play phone shot: 320–3840px, longest ≤ 2× shortest (2582/1320 ≈ 1.96) | **One valid phone screenshot** |
| `screen-discover.png` / `screen-library.png` | — | — | — | Play listing needs **≥2** screenshots | **Missing** (deleted in `bb96f9d`, 2026-08-11) |

README previously labeled `feature-graphic.png` as “Play feature graphic 1024×500”. That label was **incorrect**; this PR documents the real 1024×1024 logo.

No tablet, Wear, TV, or App Store device-size screenshot sets are in the repo.

This PR does **not** generate replacement graphics.

---

## 4. Fixes in this PR (safe content/docs only)

- `REPORT.md` — this audit.
- `README.md` — real tree, GitHub Pages hosting, store URL table, TLS caveat, asset dimension table.
- `privacy.html` — iOS coverage, store URL stated on-page, third-party equal-protection sentence, withdraw-consent path, iOS permissions note, footer link to delete-account, last-updated 2026-09-16.
- `delete-account.html` — iOS mentioned in the applies-to line.
- `index.html` — `og:image` changed from a relative path to `https://visionmusic.et/assets/img/feature-graphic.png`.

**Not done (out of scope)**

- DNS, Cloudflare, GitHub Pages “Enforce HTTPS”.
- Regenerating a 1024×500 feature graphic or extra screenshots.
- Removing `kayo-game/` (public but unlinked).
- Publishing / promoting this to `main`.

---

## Commands / evidence appendix

```text
# TLS subject (2026-09-16)
openssl s_client -connect visionmusic.et:443 -servername visionmusic.et
# → subject=CN = *.github.io

# Verifying curl (fails)
curl -I https://visionmusic.et/privacy.html
# → curl: (60) SSL: no alternative certificate subject name matches target host name

# Insecure HTTPS and plain HTTP (succeed)
curl -k -I https://visionmusic.et/privacy.html   # HTTP/2 200, 8559 bytes pre-PR
curl -I http://visionmusic.et/privacy.html       # HTTP/1.1 200

# GitHub Pages
gh api repos/Birra3324/visionmusic-site/pages
# https_enforced=false, cname=visionmusic.et
```
