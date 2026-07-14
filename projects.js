/*
  ============================================
  PROJECTS.JS
  ============================================
  Add a new micro:bit project by copying one of the objects below
  and editing the fields. That's it — the page rebuilds itself.

  Fields:
    title       — project name, shown on the card
    description — one or two sentences, shown on the card
    icon        — a 5x5 pattern for the little LED icon.
                   5 strings of 5 characters, "1" = lit, "0" = off.
    tags        — short list of labels (language, category, etc.)
    repoUrl     — link to the code (GitHub repo or file)
    demoUrl     — optional link to a live demo / MakeCode share link.
                   Leave as "" (empty string) if there isn't one —
                   the Play button just won't be shown.
*/

const PROJECTS = [
  { 
    {
  title: "Radioz",
  description: "A sentence or two about what Radioz does.",
  icon: [
    "00110",
    "01100",
    "11111",
    "00110",
    "01100",
  ],
  tags: ["MakeCode", "radio"],
  repoUrl: "https://github.com/thatmicrodev/radioz",
  demoUrl: "https://makecode.microbit.org/_7CpJWyMVPc4M",
},
  },
];
