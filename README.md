# micro:lab

A no-build-step website for your BBC micro:bit projects and games. It reads its project list live from this repo's **GitHub Releases** — publish a release, and a card appears on the site automatically. Nothing to edit.

## Files

```
index.html    the page itself
style.css     all the styling
script.js     runs the site — fetches your Releases and builds the cards
README.md     this file
```

## 1. Set it up once

Open `script.js`, near the top:

```js
const GITHUB_OWNER = "thatmicrodev";
const GITHUB_REPO = "microbit";
```

Make sure these match your actual GitHub username and repo name. Then upload/push all four files to that repo.

## 2. Turn on GitHub Pages

**Settings → Pages → Source: "Deploy from a branch" → Branch: `main`, folder `/ (root)` → Save.**

Your site will be live at `https://your-username.github.io/your-repo/`.

## 3. Add a project — the only step you'll repeat

1. On your repo, go to the **Releases** tab (right sidebar, or `/releases/new`).
2. Click **Draft a new release**.
3. Give it a tag (e.g. `v1.0`) and a title (e.g. `Radioz`).
4. In the description box, write a sentence or two about what it does.
5. Drag your program file into the **Attach binaries** box — the `.hex` file from MakeCode, a `.py`, a zip, whatever you've got.
6. Click **Publish release**.

That's it. Refresh the site and the card is there — icon, title, description, a **Release page** link, and a **Download** button for every file you attached.

## Notes

- No editing required for new projects — ever. The site calls GitHub's public API to list releases each time someone loads the page.
- If a project doesn't show up, double-check `GITHUB_OWNER` / `GITHUB_REPO` in `script.js` and make sure the repo is **public**.
- Each card gets an automatic 5x5 LED-style icon, picked consistently based on the project's title — no icon file to design or upload.
- The hero's 5x5 grid is genuinely clickable: it auto-scrolls a message on load, and switches into a free-toggle "draw your own pattern" mode the moment you click a dot.
