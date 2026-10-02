# Screensavers

Web-based screensavers for macOS, each a single self-contained HTML page. They're shown on the lock screen through [WebViewScreenSaver](https://github.com/liquidx/webviewscreensaver), so the Mac stays locked and touching it brings up the password prompt.

Gallery: **https://rajathpi.github.io/screensavers/**

| Screensaver | Preview | URL |
|---|---|---|
| [Shan Shui](shan-shui/) | Endless Chinese ink landscape, slowly scrolling. Different on every screen. | `https://rajathpi.github.io/screensavers/shan-shui/` |
| [Peekaboo](peekaboo/) | A little ink cat pops in now and then and does something different every time. | `https://rajathpi.github.io/screensavers/peekaboo/` |
| [Ink Flow](ink-flow/) | Ink particles trace a flow field into a drawing, then start a new one. | `https://rajathpi.github.io/screensavers/ink-flow/` |

## Setup on a Mac (one time)

1. **Install WebViewScreenSaver**
   ```bash
   brew install --cask webviewscreensaver
   ```
   You can also download it from its [releases page](https://github.com/liquidx/webviewscreensaver/releases). If macOS blocks it, allow it under System Settings → Privacy & Security.
2. **Pick it:** System Settings → Screen Saver → **WebViewScreenSaver** → Options. Add a screensaver URL from the table above and set its duration so it never rotates.
3. **Lock it:** System Settings → Lock Screen
   - Start Screen Saver when inactive → **1 minute**
   - Require password after screen saver begins → **Immediately**
   - Turn display off when inactive → **longer than your lunch** (otherwise the screens just go black)

**Daily use:** tap the power / Touch ID button (or press `Ctrl + Cmd + Q`). The Mac locks, and about a minute later the screensaver plays on every display. Any touch brings up the password prompt.

Laptop tip: keep the lid open or the charger connected. Closing the lid on battery puts the Mac to sleep and turns off all the screens.

## Adding a new screensaver

1. Create a folder: `my-design/index.html`. It must be self-contained (no build server needed) and fill the window.
2. Good habits for screensaver pages:
   - `cursor: none` and no UI. The host handles exiting.
   - Randomise per load, so each display shows something different.
   - Never let memory grow without limit, since it may run for hours.
   - Accept options as URL query parameters.
3. Add a `preview.jpg` (1920×1080) and a `README.md`.
4. Add a row to the table above and a card to [index.html](index.html).

`tools/screenshot.mjs` captures a real-time 1920×1080 screenshot through headless Chrome, for previews:

```bash
node tools/screenshot.mjs "http://localhost:8047/my-design/" my-design/preview.jpg 15000
```

Serve locally with `python -m http.server 8047` from the repo root. Set `CHROME` to override the browser path.
