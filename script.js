/* ============================================
   micro:lab — script.js
   Two jobs:
     1. Pull your GitHub Releases and turn each one into a project card
     2. Run the interactive 5x5 LED hero (auto-scrolls text,
        becomes click-to-toggle the moment you touch a dot)
   ============================================ */

// ---- CONFIG: change these two lines to your repo ----
const GITHUB_OWNER = "thatmicrodev";
const GITHUB_REPO = "microbit";
// -------------------------------------------------------

// A small pool of 5x5 icon patterns. Each release gets one automatically,
// picked deterministically from its title, so the same project always
// gets the same icon.
const ICON_PATTERNS = [
  ["00110", "01100", "11111", "00110", "01100"], // bolt
  ["01010", "11111", "11111", "01110", "00100"], // heart
  ["00100", "01110", "10101", "00100", "00100"], // signal
  ["10001", "00000", "00100", "00000", "10001"], // dice
  ["11100", "00100", "00111", "00100", "11100"], // zigzag
  ["01000", "00100", "01000", "00010", "00001"], // steps
];

function iconForTitle(title) {
  let sum = 0;
  for (const ch of title) sum += ch.charCodeAt(0);
  return ICON_PATTERNS[sum % ICON_PATTERNS.length];
}

// Strips the common Markdown symbols out of a release body so it reads
// as plain text on the card, and trims it down to a card-friendly length.
function cleanDescription(body) {
  if (!body) return "No description provided.";
  const plain = body
    .replace(/```[\s\S]*?```/g, "")      // code blocks
    .replace(/!\[.*?\]\(.*?\)/g, "")     // images
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")  // links -> just the text
    .replace(/[#*_`>-]/g, "")            // markdown symbols
    .replace(/\r?\n+/g, " ")             // newlines -> spaces
    .trim();
  if (!plain) return "No description provided.";
  return plain.length > 160 ? plain.slice(0, 157).trim() + "…" : plain;
}

function buildIconEl(pattern) {
  const icon = document.createElement("div");
  icon.className = "card-icon";
  icon.setAttribute("aria-hidden", "true");
  pattern.forEach((row) => {
    row.split("").forEach((bit) => {
      const dot = document.createElement("span");
      if (bit === "1") dot.classList.add("on");
      icon.appendChild(dot);
    });
  });
  return icon;
}

function buildCard(release) {
  const card = document.createElement("article");
  card.className = "project-card";

  const top = document.createElement("div");
  top.className = "card-top";

  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = release.name || release.tag_name;

  top.appendChild(title);
  top.appendChild(buildIconEl(iconForTitle(title.textContent)));

  const desc = document.createElement("p");
  desc.className = "card-desc";
  desc.textContent = cleanDescription(release.body);

  const tags = document.createElement("div");
  tags.className = "card-tags";
  const versionTag = document.createElement("span");
  versionTag.className = "tag";
  versionTag.textContent = release.tag_name;
  tags.appendChild(versionTag);
  if (release.prerelease) {
    const preTag = document.createElement("span");
    preTag.className = "tag";
    preTag.textContent = "pre-release";
    tags.appendChild(preTag);
  }

  const links = document.createElement("div");
  links.className = "card-links";

  const notesLink = document.createElement("a");
  notesLink.href = release.html_url;
  notesLink.className = "btn btn-secondary";
  notesLink.textContent = "Release page";
  notesLink.target = "_blank";
  notesLink.rel = "noopener noreferrer";
  links.appendChild(notesLink);

  (release.assets || []).forEach((asset) => {
    const dl = document.createElement("a");
    dl.href = asset.browser_download_url;
    dl.className = "btn btn-primary";
    dl.textContent = `Download ${asset.name}`;
    links.appendChild(dl);
  });

  card.appendChild(top);
  card.appendChild(desc);
  card.appendChild(tags);
  card.appendChild(links);
  return card;
}

async function renderProjects() {
  const grid = document.getElementById("projectGrid");
  if (!grid) return;

  grid.innerHTML = '<div class="empty-state">Loading releases…</div>';

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases`,
      { headers: { Accept: "application/vnd.github+json" } }
    );

    if (!res.ok) {
      throw new Error(`GitHub API responded with ${res.status}`);
    }

    const releases = await res.json();

    if (!Array.isArray(releases) || releases.length === 0) {
      grid.innerHTML =
        '<div class="empty-state">No releases yet — publish one on GitHub with your project attached and it\'ll show up here.</div>';
      return;
    }

    grid.innerHTML = "";
    const frag = document.createDocumentFragment();
    releases.forEach((release) => frag.appendChild(buildCard(release)));
    grid.appendChild(frag);
  } catch (err) {
    grid.innerHTML =
      '<div class="empty-state">Couldn\'t load releases right now. Check that GITHUB_OWNER / GITHUB_REPO at the top of script.js match your repo, and that the repo is public.</div>';
    console.error("Failed to load GitHub releases:", err);
  }
}

renderProjects();


(function ledHero() {
  const gridEl = document.getElementById('ledMatrix');
  const restartBtn = document.getElementById('matrixRestart');
  const hint = document.querySelector('.matrix-hint');
  if (!gridEl) return;

  const ROWS = 5, COLS = 5;

  // Minimal 3-wide x 5-tall pixel font. Good enough to read at a glance,
  // not a full typeface. Add more letters here if you extend the message.
  const FONT = {
    ' ': ["000","000","000","000","000"],
    A: ["010","101","111","101","101"],
    B: ["110","101","110","101","110"],
    C: ["011","100","100","100","011"],
    D: ["110","101","101","101","110"],
    E: ["111","100","111","100","111"],
    F: ["111","100","111","100","100"],
    G: ["011","100","101","101","011"],
    H: ["101","101","111","101","101"],
    I: ["111","010","010","010","111"],
    J: ["001","001","001","101","010"],
    K: ["101","110","100","110","101"],
    L: ["100","100","100","100","111"],
    M: ["101","111","111","101","101"],
    N: ["101","111","111","111","101"],
    O: ["010","101","101","101","010"],
    P: ["110","101","110","100","100"],
    Q: ["010","101","101","111","011"],
    R: ["110","101","110","110","101"],
    S: ["011","100","010","001","110"],
    T: ["111","010","010","010","010"],
    U: ["101","101","101","101","111"],
    V: ["101","101","101","101","010"],
    W: ["101","101","111","111","101"],
    X: ["101","101","010","101","101"],
    Y: ["101","101","010","010","010"],
    Z: ["111","001","010","100","111"],
  };

  const MESSAGE = "MICROBIT PROJECTS    ";

  // Build a column buffer: each entry is a 5-bit column (array of 0/1, length ROWS)
  function buildColumnBuffer(message) {
    const cols = [];
    for (const ch of message.toUpperCase()) {
      const glyph = FONT[ch] || FONT[' '];
      for (let c = 0; c < 3; c++) {
        const col = [];
        for (let r = 0; r < 5; r++) col.push(glyph[r][c] === '1' ? 1 : 0);
        cols.push(col);
      }
      cols.push([0, 0, 0, 0, 0]); // 1px gap after every character
    }
    return cols;
  }

  const buffer = buildColumnBuffer(MESSAGE);

  // Build the 25 dot buttons once
  const dots = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'led-dot';
      btn.setAttribute('aria-label', `LED row ${r + 1}, column ${c + 1}`);
      btn.dataset.row = r;
      btn.dataset.col = c;
      gridEl.appendChild(btn);
      dots.push(btn);
    }
  }

  function setDot(r, c, on) {
    const btn = dots[r * COLS + c];
    btn.classList.toggle('lit', !!on);
  }

  function renderFrame(startIndex) {
    for (let c = 0; c < COLS; c++) {
      const bufCol = buffer[(startIndex + c) % buffer.length];
      for (let r = 0; r < ROWS; r++) {
        setDot(r, c, bufCol[r]);
      }
    }
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let scrollIndex = 0;
  let intervalId = null;
  let interactive = false;

  function startScroll() {
    interactive = false;
    restartBtn.hidden = true;
    hint.textContent = 'try clicking a dot';
    if (intervalId) clearInterval(intervalId);
    if (prefersReducedMotion) {
      renderFrame(0);
      return;
    }
    intervalId = setInterval(() => {
      scrollIndex = (scrollIndex + 1) % buffer.length;
      renderFrame(scrollIndex);
    }, 160);
  }

  function stopScrollForInteraction() {
    if (interactive) return;
    interactive = true;
    if (intervalId) clearInterval(intervalId);
    restartBtn.hidden = false;
    hint.textContent = "you're driving now";
  }

  dots.forEach((btn) => {
    btn.addEventListener('click', () => {
      stopScrollForInteraction();
      btn.classList.toggle('lit');
    });
  });

  restartBtn.addEventListener('click', () => {
    scrollIndex = 0;
    startScroll();
  });

  startScroll();
})();
