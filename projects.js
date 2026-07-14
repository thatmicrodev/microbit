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
    title: "Reaction Timer",
    description: "Waits a random delay, lights up, and clocks how fast you mash button A. High score saved between rounds.",
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
  },
  {
    title: "Dice Roller",
    description: "Shake the board to roll a six-sided die. Uses the accelerometer to detect the shake and the radio to pass results to a second board.",
    icon: [
      "10001",
      "00000",
      "00100",
      "00000",
      "10001",
    ],
    tags: ["Python", "accelerometer", "radio"],
    repoUrl: "https://github.com/your-username/dice-roller",
    demoUrl: "",
  },
  {
    title: "Micro:Snake",
    description: "Classic snake, squeezed onto a 5x5 grid. Tilt to steer, eat the blinking pixel, don't hit yourself.",
    icon: [
      "11100",
      "00100",
      "00111",
      "00100",
      "11100",
    ],
    tags: ["MakeCode", "game", "tilt-control"],
    repoUrl: "https://github.com/your-username/micro-snake",
    demoUrl: "",
  },
  {
    title: "Love-o-Meter",
    description: "Touch the two pins with your hands — the temperature-adjusted resistance reading fills up a heart on the display.",
    icon: [
      "01010",
      "11111",
      "11111",
      "01110",
      "00100",
    ],
    tags: ["Python", "sensors", "beginner"],
    repoUrl: "https://github.com/your-username/love-o-meter",
    demoUrl: "",
  },
  {
    title: "Step Counter",
    description: "Pocket pedometer using the accelerometer's step-detection pattern, with the count scrolling across the display on button press.",
    icon: [
      "01000",
      "00100",
      "01000",
      "00010",
      "00001",
    ],
    tags: ["MakeCode", "accelerometer", "wearable"],
    repoUrl: "https://github.com/your-username/step-counter",
    demoUrl: "",
  },
];
