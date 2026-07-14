# micro:lab

A small, no-build-step website for showing off your BBC micro:bit projects and games. Just HTML, CSS, and vanilla JS — free to host on GitHub Pages.

## What's in here

```
index.html    the page itself
style.css     all the styling
projects.js   your project list — edit this to add/remove projects
script.js     renders the project cards + runs the interactive LED hero
README.md     this file
```

## 1. Put it on GitHub

1. Create a new repository on GitHub (e.g. `microbit-projects`).
2. Upload these five files to it (drag-and-drop on the GitHub web UI works fine, or `git push` if you're comfortable with git).

## 2. Turn on GitHub Pages

1. In your repo, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
3. Set **Branch** to `main` (or `master`) and folder to `/ (root)`.
4. Click **Save**. GitHub will give you a URL like:
   `https://your-username.github.io/microbit-projects/`
   It can take a minute or two to go live the first time.

## 3. Add your own projects

Open `projects.js`. Each project is one entry in the `PROJECTS` list:

```js
{
  title: "Reaction Timer",
  description: "One or two sentences about what it does.",
  icon: [
    "00110",
    "01100",
    "11111",
    "00110",
    "01100",
  ],
  tags: ["MakeCode", "game", "buttons"],
  repoUrl: "https://github.com/your-username/reaction-timer",
  demoUrl: "",
}
```

- **title / description** — plain text.
- **icon** — a 5×5 pattern for the little LED icon on the card. `"1"` = lit, `"0"` = off. Each project can have its own little pixel-art symbol.
- **tags** — short labels, as many or few as you like.
- **repoUrl** — link to that project's code.
- **demoUrl** — if you have a live demo (e.g. a MakeCode share link, or a page that simulates the project), put it here and a "Play" button will show up automatically. Leave it as `""` to skip it.

Copy an existing entry, paste it above or below, edit the fields, save, and push. No other file needs to change.

## 4. Customize the look (optional)

All the colors, fonts, and spacing live at the top of `style.css` under `:root` — change a value there and it updates everywhere it's used. The hero's scrolling message is set in `script.js` in the `MESSAGE` constant, using a small built-in pixel font (A–Z and space).

## Notes

- No build tools, no npm install — open `index.html` in a browser and it just works, or serve the folder locally with something like `python3 -m http.server`.
- The hero's 5×5 LED grid is genuinely clickable: it auto-scrolls a message on load, and switches into a free-toggle "draw your own pattern" mode the moment you click a dot, with a restart button to bring the scroll back.
