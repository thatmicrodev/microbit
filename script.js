/* ============================================
   micro:lab — script.js
   Two jobs:
     1. Render the project cards from PROJECTS (see projects.js)
     2. Run the interactive 5x5 LED hero (auto-scrolls text,
        becomes click-to-toggle the moment you touch a dot)
   ============================================ */

(function renderProjects() {
  const grid = document.getElementById('projectGrid');
  if (!grid) return;

  if (!window.PROJECTS || PROJECTS.length === 0) {
    grid.innerHTML = '<div class="empty-state">No projects yet — add one in projects.js</div>';
    return;
  }

  const frag = document.createDocumentFragment();

  PROJECTS.forEach((project) => {
    const card = document.createElement('article');
    card.className = 'project-card';

    const top = document.createElement('div');
    top.className = 'card-top';

    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = project.title;

    const icon = document.createElement('div');
    icon.className = 'card-icon';
    icon.setAttribute('aria-hidden', 'true');
    const iconRows = project.icon || ["00000","00000","00000","00000","00000"];
    iconRows.forEach((row) => {
      row.split('').forEach((bit) => {
        const dot = document.createElement('span');
        if (bit === '1') dot.classList.add('on');
        icon.appendChild(dot);
      });
    });

    top.appendChild(title);
    top.appendChild(icon);

    const desc = document.createElement('p');
    desc.className = 'card-desc';
    desc.textContent = project.description || '';

    const tags = document.createElement('div');
    tags.className = 'card-tags';
    (project.tags || []).forEach((t) => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = t;
      tags.appendChild(tag);
    });

    const links = document.createElement('div');
    links.className = 'card-links';

    if (project.repoUrl) {
      const codeLink = document.createElement('a');
      codeLink.href = project.repoUrl;
      codeLink.className = 'btn btn-secondary';
      codeLink.textContent = 'View code';
      codeLink.target = '_blank';
      codeLink.rel = 'noopener noreferrer';
      links.appendChild(codeLink);
    }

    if (project.demoUrl) {
      const demoLink = document.createElement('a');
      demoLink.href = project.demoUrl;
      demoLink.className = 'btn btn-primary';
      demoLink.textContent = 'Play';
      demoLink.target = '_blank';
      demoLink.rel = 'noopener noreferrer';
      links.appendChild(demoLink);
    }

    card.appendChild(top);
    card.appendChild(desc);
    if ((project.tags || []).length) card.appendChild(tags);
    if (links.childNodes.length) card.appendChild(links);

    frag.appendChild(card);
  });

  grid.appendChild(frag);
})();


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
