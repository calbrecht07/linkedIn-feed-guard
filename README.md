# LinkedIn Feed Guard

A tiny Firefox extension that nudges you out of aimless scrolling on the LinkedIn feed.

## What it does

- **On the feed** (`linkedin.com/feed`): a solid orange line sits across the top of the window, so you notice right away where you are.
- **While you scroll the feed:** the orange line thickens and glows, and a second, brighter line grows underneath it with how far you've scrolled. Five screen heights in one go fills it edge to edge.
- **When you stop scrolling:** the glow fades and the scroll line resets to zero, ready for the next burst.
- **Everywhere else on LinkedIn** (messages, profiles, jobs, notifications): nothing shows. On other sites the extension doesn't run at all.

It needs no permissions beyond running on `linkedin.com`. It collects nothing, stores nothing and makes no network requests.

## What's in the repo

| File | Purpose |
| --- | --- |
| `manifest.json` | Extension manifest: name, version, and the rule that runs `content.js` on `*.linkedin.com` pages only. |
| `content.js` | All the logic. Detects the feed (LinkedIn is a single-page app, so it checks the URL every 500 ms), draws the orange line, and tracks scrolling for the scroll line. |
| `README.md` | This file. |

## Install for testing (temporary)

1. Open `about:debugging#/runtime/this-firefox` in Firefox.
2. Click **Load Temporary Add-on...** and pick `manifest.json` from this folder.
3. Visit [linkedin.com/feed](https://www.linkedin.com/feed/).

After editing the code, click **Reload** on the extension's card in `about:debugging`, then refresh LinkedIn. Temporary add-ons are removed when Firefox restarts.

## Install permanently

Regular Firefox only installs signed extensions. Signing is free and the extension stays private:

1. Zip the extension (the files need to be at the root of the zip):
   ```bash
   zip -r linkedin-feed-guard.zip manifest.json content.js
   ```
2. Go to the [Add-on Developer Hub](https://addons.mozilla.org/developers/addon/submit/distribution) and sign in with a Firefox account.
3. Choose **On your own** (unlisted, not published on the store) and upload the zip.
4. Once it's approved (usually within minutes), download the signed `.xpi` and drag it into Firefox.

For later updates, bump `version` in `manifest.json` and upload again.

**Alternative:** in Firefox Developer Edition or Nightly, set `xpinstall.signatures.required` to `false` in `about:config`, then install the unsigned zip from `about:addons` (gear icon, **Install Add-on From File...**).

## Tweaks

Constants at the top of `content.js`:

- `SCREENS_TO_FILL`: how many screen heights of continuous scrolling fill the scroll line.
- `IDLE_MS`: how long scrolling has to stop before the scroll line resets.
- `ORANGE` / `HOT`: colors of the top line and the scroll line.
