// =========================
// CONFIG
// =========================
const DS_BADGE_KEY = "death_strike_mastery";
const DS_XP_REWARD = 150;

// =========================
// XP + BADGE INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const xpEl = document.getElementById("xpDisplay");
  const badgeEl = document.getElementById("badgeDisplay");

  if (xpEl) {
    const xp = parseInt(localStorage.getItem("guild_xp") || "0");
    xpEl.textContent = "XP: " + xp;
  }

  if (badgeEl) {
    if (localStorage.getItem(DS_BADGE_KEY) === "earned") {
      badgeEl.innerHTML = `<div class="badge-earned">DEATH STRIKE BADGE</div>`;
    }
  }

  setupDSModule();
});

// =========================
// CONTENT SECTIONS
// =========================
const DS_SECTIONS = {
  info: `
    <h2>The Death Strike Doctrine</h2>
    <p>
      The Death Strike is the Guild’s sacred technique — the moment when a contract’s price multiplies with violent speed.
      This is precision, timing, and discipline. A contract is not the stock — it is the <strong>price of possibility</strong>.
    </p>

    <div class="example-box">
      <h3>1 Contract → $1 to $10</h3>
      <p>Your $1 becomes $10. A clean 10× multiplication.</p>
    </div>

    <div class="example-box">
      <h3>10 Contracts → $10 to $100</h3>
      <p>The same move, scaled. The multiplication is identical — only your risk changes.</p>
    </div>

    <div class="example-box">
      <h3>100 Contracts → $100 to $1,000</h3>
      <p>Size changes the outcome — not the math. Discipline decides whether you keep it.</p>
    </div>

    <h2>The Truth Behind Explosive Contracts</h2>
    <p>
      Contracts can explode to $40, $100, $300, even $1,000. These moves happen every weekday.
      The question is not <em>if</em> they happen — it is whether you are positioned when they do.
    </p>

    <div class="ds-callout">
      <strong>Death Strike Rules:</strong>
      <ul>
        <li>Buy at the MID — never chase the extremes.</li>
        <li>Sell at the MID — do not wait for perfection.</li>
        <li>Respect the fire timer — hesitation kills the move.</li>
        <li>Size small until your discipline is proven.</li>
      </ul>
    </div>

    <p>
      Inside the Arena, you will practice this under pressure — real‑time moving prices, strict timers,
      and forced exits. The goal is not luck. The goal is <strong>repeatable execution</strong>.
    </p>
  `,

  quiz: `
    <h2>Death Strike Quiz</h2>
    <p>
      Prove you understand the Death Strike before you enter deeper levels of the Arena.
      A perfect score awards XP and the Death Strike badge.
    </p>

    <div id="dsQuizBox"></div>
  `,

  arena: `
    <h2>Arena Tower — Death Strike Trials</h2>
    <p>
      The Arena is where theory becomes reflex. Each level increases pressure, speed, and complexity.
      You will face moving prices, strict timers, and MID‑based execution.
    </p>

    <div class="ds-arena-levels">
      <button class="ds-btn" data-level="1">Enter Level 1 — Calm Market</button>
      <button class="ds-btn" data-level="2">Enter Level 2 — Rising Fire</button>
      <button class="ds-btn" data-level="3">Enter Level 3 — Volatile Storm</button>
      <button class="ds-btn" data-level="4">Enter Level 4 — Death Strike Gauntlet</button>
    </div>

    <p class="ds-arena-note">
      Each level opens in its own full‑screen Arena page. Complete the trials there to earn XP and badges
      through the simulator engines.
    </p>
  `
};

// =========================
// QUIZ DATA
// =========================
const DS_QUIZ = [
  {
    q: "What is the Death Strike in Guild terms?",
    options: [
      "A random lucky trade",
      "A controlled, explosive move in a contract’s price",
      "A long‑term investment",
      "A hedge against losses"
    ],
    answer: 1
  },
  {
    q: "What is the purpose of buying at the MID?",
    options: [
      "To chase the highest price",
      "To guarantee the bottom",
      "To enter where spreads are fair and risk is controlled",
      "To avoid taking any risk"
    ],
    answer: 2
  },
  {
    q: "Why is size (quantity) dangerous during a Death Strike?",
    options: [
      "Because contracts never move",
      "Because size amplifies both gains and mistakes",
      "Because brokers block large orders",
      "Because it changes the trend"
    ],
    answer: 1
  },
  {
    q: "What does the fire timer represent?",
    options: [
      "Random countdown",
      "Your broker’s margin call",
      "The limited window where the move is valid",
      "Time until the market closes"
    ],
    answer: 2
  }
];

// =========================
// MODULE SETUP
// =========================
function setupDSModule() {
  const panel = document.getElementById("dsPanel");
  const menuItems = document.querySelectorAll(".ds-menu-item");
  if (!panel || !menuItems.length) return;

  function setSection(key) {
    panel.innerHTML = DS_SECTIONS[key] || "";
    if (key === "quiz") {
      startDSQuiz();
    }
    if (key === "arena") {
      setupArenaButtons();
    }
  }

  menuItems.forEach(item => {
    item.addEventListener("click", () => {
      menuItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      setSection(item.dataset.section);
    });
  });

  // Default section
  setSection("info");
}

// =========================
// QUIZ ENGINE
// =========================
function startDSQuiz() {
  const box = document.getElementById("dsQuizBox");
  if (!box) return;

  let index = 0;
  let score = 0;

  function renderQuestion() {
    const q = DS_QUIZ[index];
    box.innerHTML = `
      <div class="ds-quiz-q">${q.q}</div>
      <div class="ds-quiz-options">
        ${q.options
          .map(
            (opt, i) =>
              `<button class="ds-quiz-opt" data-i="${i}">${opt}</button>`
          )
          .join("")}
      </div>
      <div class="ds-quiz-progress">
        Question ${index + 1} of ${DS_QUIZ.length}
      </div>
    `;

    box.querySelectorAll(".ds-quiz-opt").forEach(btn => {
      btn.addEventListener("click", () => {
        const choice = parseInt(btn.dataset.i);
        if (choice === q.answer) score++;
        index++;

        if (index < DS_QUIZ.length) {
          renderQuestion();
        } else {
          finishQuiz();
        }
      });
    });
  }

  function finishQuiz() {
    box.innerHTML = `
      <div class="ds-quiz-result">
        You scored <strong>${score}</strong> out of <strong>${DS_QUIZ.length}</strong>.
      </div>
    `;

    if (score === DS_QUIZ.length) {
      let xp = parseInt(localStorage.getItem("guild_xp") || "0");
      xp += DS_XP_REWARD;
      localStorage.setItem("guild_xp", xp);
      localStorage.setItem(DS_BADGE_KEY, "earned");

      const xpEl = document.getElementById("xpDisplay");
      const badgeEl = document.getElementById("badgeDisplay");
      if (xpEl) xpEl.textContent = "XP: " + xp;
      if (badgeEl) {
        badgeEl.innerHTML = `<div class="badge-earned">DEATH STRIKE BADGE</div>`;
      }

      box.innerHTML += `
        <div class="ds-quiz-result">
          Perfect score — <strong>+${DS_XP_REWARD} XP</strong> and Death Strike badge unlocked.
        </div>
      `;
    } else {
      box.innerHTML += `
        <div class="ds-quiz-result">
          Study the Death Strike doctrine and try again for full mastery.
        </div>
      `;
    }
  }

  renderQuestion();
}

// =========================
// ARENA BUTTONS → FULL PAGES
// =========================
function setupArenaButtons() {
  const buttons = document.querySelectorAll(".ds-arena-levels .ds-btn");
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const level = btn.dataset.level;
      if (!level) return;

      // Full-screen navigation to Arena pages
      const url = `/guild/pages/arena/arena-level${level}.html`;
      window.location.href = url;
    });
  });
}
