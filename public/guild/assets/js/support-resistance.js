// =========================
// DROPDOWNS (Arcane Sections)
// =========================
function initDropdowns() {
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach(drop => {
    const header = drop.querySelector(".dropdown-header");
    const content = drop.querySelector(".dropdown-content");

    if (!header || !content) return;

    header.addEventListener("click", () => {
      const isOpen = drop.classList.contains("open");

      document.querySelectorAll(".dropdown").forEach(d => {
        d.classList.remove("open");
        const c = d.querySelector(".dropdown-content");
        if (c) c.style.display = "none";
      });

      if (!isOpen) {
        drop.classList.add("open");
        content.style.display = "block";
      }
    });
  });
}

// =========================
// HINT TICKER
// =========================
const SR_HINTS = [
  "Support is stronger when it has been tested multiple times.",
  "Resistance breaks with volume — not hope.",
  "A level is not broken until it closes beyond it.",
  "Support becomes resistance after a breakdown.",
  "Resistance becomes support after a breakout.",
  "Price reacts to zones, not perfect lines.",
  "The more obvious the level, the more powerful the reaction.",
  "Ancient levels on higher timeframes command the most respect.",
  "A clean retest after a breakout is a gift — not a guarantee."
];

function startSRHints() {
  const el = document.getElementById("sr-hints");
  if (!el) return;

  function setHint() {
    el.textContent = SR_HINTS[Math.floor(Math.random() * SR_HINTS.length)];
  }

  setHint();
  setInterval(setHint, 6000);
}

// =========================
// GUILD QUIZ (Arcane Trial)
// =========================
const SR_QUIZ = [
  {
    q: "You see price bounce three times from the same zone with increasing volume on each bounce. What is this level becoming?",
    options: [
      "A strong support zone.",
      "A weak resistance level.",
      "A random consolidation area.",
      "A signal to avoid the chart."
    ],
    answer: 0,
    lore: "Repeated bounces with volume show buyers defending the same ground — the mark of strong support."
  },
  {
    q: "Price closes above a long‑term resistance with strong volume, then calmly retests that level from above. What is this called?",
    options: [
      "A fakeout.",
      "A resistance → support flip.",
      "A double top.",
      "A wedge breakdown."
    ],
    answer: 1,
    lore: "When old resistance holds as new support, the level has ascended in rank — a classic Guild confirmation."
  },
  {
    q: "In a rising wedge, price keeps making higher lows but struggles to push higher at resistance. What is this structure often warning?",
    options: [
      "A potential breakdown once the structure fails.",
      "A guaranteed breakout to the upside.",
      "That support is unbreakable.",
      "That volume no longer matters."
    ],
    answer: 0,
    lore: "Rising wedges compress price into a corner — once energy runs out, the break is often sharp."
  },
  {
    q: "You draw a trendline support that aligns perfectly with a horizontal support zone from the past. How should you treat this confluence?",
    options: [
      "As noise — only indicators matter.",
      "As a high‑interest zone for potential entries.",
      "As a place to always short.",
      "As irrelevant unless on a 1‑minute chart."
    ],
    answer: 1,
    lore: "When diagonal and horizontal structure agree, the Guild pays attention — confluence is power."
  },
  {
    q: "Price wicks above resistance multiple times but keeps closing back below. What is the market telling you?",
    options: [
      "Buyers are fully in control.",
      "Sellers are defending that level.",
      "The level is meaningless.",
      "A breakout has already confirmed."
    ],
    answer: 1,
    lore: "Wicks above resistance with weak closes show rejection — the ceiling is still guarded."
  }
];

let srIndex = 0;
let quizLocked = false;

function loadSRQuestion() {
  const qBox = document.getElementById("sr-question");
  const optBox = document.getElementById("sr-options");
  const nextBtn = document.getElementById("sr-next-btn");
  const result = document.getElementById("sr-result");

  if (!qBox || !optBox || !nextBtn || !result) return;

  const item = SR_QUIZ[srIndex];

  qBox.textContent = item.q;
  optBox.innerHTML = "";
  result.textContent = "";
  nextBtn.style.display = "none";
  quizLocked = false;

  item.options.forEach((opt, i) => {
    const btn = document.createElement("div");
    btn.className = "quiz-option";
    btn.textContent = opt;

    btn.addEventListener("click", () => {
      if (quizLocked) return;
      quizLocked = true;

      if (i === item.answer) {
        btn.classList.add("correct");
        result.textContent = "Correct — " + item.lore;
        result.style.color = "#4CAF50";
      } else {
        btn.classList.add("incorrect");
        result.textContent = "Incorrect — " + item.lore;
        result.style.color = "#FF5252";
      }

      nextBtn.style.display = "inline-block";
    });

    optBox.appendChild(btn);
  });
}

function nextSRQuestion() {
  srIndex++;

  const qBox = document.getElementById("sr-question");
  const optBox = document.getElementById("sr-options");
  const nextBtn = document.getElementById("sr-next-btn");
  const result = document.getElementById("sr-result");

  if (!qBox || !optBox || !nextBtn || !result) return;

  if (srIndex >= SR_QUIZ.length) {
    qBox.textContent = "Trial Complete.";
    optBox.innerHTML = "";
    nextBtn.style.display = "none";
    result.textContent = "You’ve completed the Guild’s Support & Resistance trial. Review the charts, then return to the Golden Rules.";
    result.style.color = "#D4AF37";
    return;
  }

  loadSRQuestion();
}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  initDropdowns();
  startSRHints();
  loadSRQuestion();

  const nextBtn = document.getElementById("sr-next-btn");
  if (nextBtn) nextBtn.addEventListener("click", nextSRQuestion);
});
