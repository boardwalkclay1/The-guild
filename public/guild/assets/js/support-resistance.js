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
  "The more obvious the level, the more powerful the reaction."
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
// GUILD QUIZ (ONE QUESTION AT A TIME)
// =========================
const SR_QUIZ = [
  {
    q: "What is support?",
    options: [
      "A level where price tends to stop falling.",
      "A level where price tends to stop rising.",
      "A trendline drawn above price.",
      "A moving average crossover."
    ],
    answer: 0
  },
  {
    q: "What confirms a resistance breakout?",
    options: [
      "Low volume.",
      "A wick above resistance.",
      "A close above resistance with strong volume.",
      "A random spike."
    ],
    answer: 2
  },
  {
    q: "What often happens when support breaks?",
    options: [
      "Support becomes resistance.",
      "Price teleports upward.",
      "Nothing changes.",
      "Price becomes unpredictable."
    ],
    answer: 0
  },
  {
    q: "Why is support stronger after multiple tests?",
    options: [
      "Because buyers have proven they defend that level.",
      "Because sellers are getting stronger.",
      "Because indicators say so.",
      "Because the market is random."
    ],
    answer: 0
  },
  {
    q: "What is the biggest mistake traders make with resistance?",
    options: [
      "Expecting a breakout without volume.",
      "Drawing it too wide.",
      "Drawing it too low.",
      "Ignoring moving averages."
    ],
    answer: 0
  }
];

let srIndex = 0;

function loadSRQuestion() {
  const qBox = document.getElementById("sr-question");
  const optBox = document.getElementById("sr-options");
  const nextBtn = document.getElementById("sr-next-btn");
  const result = document.getElementById("sr-result");

  const item = SR_QUIZ[srIndex];

  qBox.textContent = item.q;
  optBox.innerHTML = "";
  result.textContent = "";
  nextBtn.style.display = "none";

  item.options.forEach((opt, i) => {
    const btn = document.createElement("div");
    btn.className = "quiz-option";
    btn.textContent = opt;

    btn.addEventListener("click", () => {
      if (i === item.answer) {
        result.textContent = "Correct!";
        result.style.color = "#4CAF50";
      } else {
        result.textContent = "Incorrect — review the lesson above.";
        result.style.color = "#FF5252";
      }
      nextBtn.style.display = "block";
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

  if (srIndex >= SR_QUIZ.length) {
    qBox.textContent = "Quiz Complete!";
    optBox.innerHTML = "";
    nextBtn.style.display = "none";
    result.textContent = "You’ve completed the Support & Resistance quiz.";
    result.style.color = "#D4AF37";
    return;
  }

  loadSRQuestion();
}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  startSRHints();
  loadSRQuestion();

  const nextBtn = document.getElementById("sr-next-btn");
  if (nextBtn) nextBtn.addEventListener("click", nextSRQuestion);
});
