# KayoBoard — Kayo vs The Siren Monster

KayoBoard is a small browser game you can play in under two minutes. You are Kayo. Collect golden stars on a night city grid and stay off the siren monster’s tile.

Notes sometimes call this **Kayo** or the **Cairo board**. The page title is **Kayo vs The Siren Monster**. There is no account, no admin screen, and no backend — the whole game is one HTML file.

**Play now:** [https://visionmusic.et/kayo-game/](https://visionmusic.et/kayo-game/)

## How to play

1. Press **Start** (or the center ▶ button). Moving also starts the round.
2. Move one tile at a time:
   - **Arrow keys**
   - On-screen **▲ ◀ ▶ ▼** buttons
   - **Swipe** on the canvas (phone or tablet)
3. Land on a golden star to score. Every 5 stars, the monster sleeps for a few seconds.
4. **Safe Mode** puts the monster to sleep a little longer if you need a breather.
5. If the monster lands on your tile, the round ends. Press **Restart**.

Your best score stays in this browser (`localStorage`). Clearing site data resets it.

## Tech

| Piece | Choice |
| --- | --- |
| File | [`index.html`](index.html) only |
| UI | Vanilla HTML and CSS |
| Playfield | HTML Canvas (`2d`) |
| Logic | Vanilla JavaScript in the same file |
| Build | None. No npm, no framework, no server |

The monster steps toward Kayo on a timer. Stars never spawn on Kayo or the monster. Safe Mode and the every-fifth-star power-up only pause the monster; they do not change the grid.

## Preview locally

From the repository root:

```bash
python3 -m http.server 5173 --bind 127.0.0.1
```

Open [http://127.0.0.1:5173/kayo-game/](http://127.0.0.1:5173/kayo-game/).

You can also open `kayo-game/index.html` directly in a browser. The file has no external scripts or images.

## Where it is published

This marketing site is served from the repo root (`netlify.toml` `publish = "."`, `CNAME` `visionmusic.et`). `www.visionmusic.et` redirects to `visionmusic.et`.

| URL | What you get |
| --- | --- |
| [https://visionmusic.et/kayo-game/](https://visionmusic.et/kayo-game/) | Live game (canonical) |
| [https://visionmusic.et/kayo-game/index.html](https://visionmusic.et/kayo-game/index.html) | Same file, explicit path |
| [Source on GitHub](https://github.com/Birra3324/visionmusic-site/blob/main/kayo-game/index.html) | The single file in this repo |

The Vision Music marketing site itself is [https://visionmusic.et](https://visionmusic.et). The companion mobile app is the [Vision Music Flutter app](https://github.com/Birra3324/visionmusicapp).
